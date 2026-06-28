"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { invoices, invoiceItems, payments, timeEntries, projects, settings } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import {
  recomputeInvoiceTotals,
  nextInvoiceNumber,
  refreshInvoiceStatus,
} from "@/lib/finance";
import { getSettings } from "@/lib/settings";
import { minutesToDays } from "@/lib/utils";
import { and, eq, inArray } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function plusDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function createInvoice(formData: FormData) {
  const userId = await getUserId();
  const [s] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  const number = await nextInvoiceNumber(userId);

  const [created] = await db
    .insert(invoices)
    .values({
      userId,
      companyId: str(formData.get("companyId")),
      projectId: str(formData.get("projectId")),
      number,
      issueDate: str(formData.get("issueDate")) ?? todayISO(),
      dueDate: str(formData.get("dueDate")) ?? plusDaysISO(30),
      legalMentions: s?.legalMentions ?? null,
      notes: str(formData.get("notes")),
    })
    .returning();

  revalidatePath("/facturation");
  redirect(`/facturation/factures/${created.id}`);
}

export async function updateInvoiceMeta(id: string, formData: FormData) {
  const userId = await getUserId();
  await db
    .update(invoices)
    .set({
      companyId: str(formData.get("companyId")),
      issueDate: str(formData.get("issueDate")) ?? todayISO(),
      dueDate: str(formData.get("dueDate")),
      notes: str(formData.get("notes")),
      legalMentions: str(formData.get("legalMentions")),
    })
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
  revalidatePath(`/facturation/factures/${id}`);
}

export async function addInvoiceItem(invoiceId: string, formData: FormData) {
  await getUserId();
  const description = str(formData.get("description"));
  if (!description) return;
  await db.insert(invoiceItems).values({
    invoiceId,
    description,
    quantity: str(formData.get("quantity")) ?? "1",
    unitPrice: str(formData.get("unitPrice")) ?? "0",
    vatRate: str(formData.get("vatRate")) ?? "0",
  });
  await recomputeInvoiceTotals(invoiceId);
  revalidatePath(`/facturation/factures/${invoiceId}`);
}

export async function deleteInvoiceItem(id: string, invoiceId: string) {
  await getUserId();
  await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
  await recomputeInvoiceTotals(invoiceId);
  revalidatePath(`/facturation/factures/${invoiceId}`);
}

export async function setInvoiceStatus(id: string, status: string) {
  const userId = await getUserId();
  await db
    .update(invoices)
    .set({ status: status as never })
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
  revalidatePath(`/facturation/factures/${id}`);
  revalidatePath("/facturation");
}

export async function addPayment(invoiceId: string, formData: FormData) {
  const userId = await getUserId();
  const amount = str(formData.get("amount"));
  if (!amount) return;

  await db.insert(payments).values({
    userId,
    invoiceId,
    amount,
    paidAt: str(formData.get("paidAt")) ?? todayISO(),
    method: str(formData.get("method")),
  });

  // Recalcule le total payé
  const pays = await db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
  const paid = pays.reduce((acc, p) => acc + Number(p.amount), 0);
  await db
    .update(invoices)
    .set({ paidAmount: paid.toString() })
    .where(eq(invoices.id, invoiceId));
  await refreshInvoiceStatus(invoiceId);

  revalidatePath(`/facturation/factures/${invoiceId}`);
  revalidatePath("/facturation");
}

export async function deletePayment(id: string, invoiceId: string) {
  await getUserId();
  await db.delete(payments).where(eq(payments.id, id));
  const pays = await db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
  const paid = pays.reduce((acc, p) => acc + Number(p.amount), 0);
  await db
    .update(invoices)
    .set({ paidAmount: paid.toString() })
    .where(eq(invoices.id, invoiceId));
  await refreshInvoiceStatus(invoiceId);
  revalidatePath(`/facturation/factures/${invoiceId}`);
}

export async function deleteInvoice(id: string) {
  const userId = await getUserId();
  await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
  revalidatePath("/facturation");
  redirect("/facturation");
}

/**
 * Ajoute les temps facturables non encore facturés d'un projet comme une ligne
 * exprimée en jours (TJM) : quantité = jours, prix unitaire = taux journalier.
 */
export async function billTimeEntries(invoiceId: string, projectId: string) {
  const userId = await getUserId();
  const [entries, settings] = await Promise.all([
    db
      .select()
      .from(timeEntries)
      .where(
        and(
          eq(timeEntries.userId, userId),
          eq(timeEntries.projectId, projectId),
          eq(timeEntries.billable, true),
          eq(timeEntries.invoiced, false)
        )
      ),
    getSettings(userId),
  ]);

  if (entries.length === 0) return;

  const [proj] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const hoursPerDay = Number(settings.hoursPerDay ?? 7) || 7;
  const totalMinutes = entries.reduce((s, e) => s + (e.durationMinutes ?? 0), 0);
  const rate = Number(entries[0].dailyRate ?? proj?.dailyRate ?? 0);
  const days = Math.round(minutesToDays(totalMinutes, hoursPerDay) * 100) / 100;

  await db.insert(invoiceItems).values({
    invoiceId,
    description: `Prestations ${proj?.name ?? ""} — ${days} j`,
    quantity: days.toString(),
    unitPrice: rate.toString(),
    vatRate: "0",
  });

  await db
    .update(timeEntries)
    .set({ invoiced: true })
    .where(inArray(timeEntries.id, entries.map((e) => e.id)));

  await recomputeInvoiceTotals(invoiceId);
  revalidatePath(`/facturation/factures/${invoiceId}`);
}

export async function billTimeEntriesForm(invoiceId: string, formData: FormData) {
  const projectId = str(formData.get("projectId"));
  if (!projectId) return;
  await billTimeEntries(invoiceId, projectId);
}
