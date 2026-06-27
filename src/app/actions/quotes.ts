"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { quotes, quoteItems, invoices, invoiceItems, settings } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import {
  recomputeQuoteTotals,
  recomputeInvoiceTotals,
  nextQuoteNumber,
  nextInvoiceNumber,
} from "@/lib/finance";
import { and, eq } from "drizzle-orm";

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

export async function createQuote(formData: FormData) {
  const userId = await getUserId();
  const number = await nextQuoteNumber(userId);
  const [created] = await db
    .insert(quotes)
    .values({
      userId,
      companyId: str(formData.get("companyId")),
      projectId: str(formData.get("projectId")),
      number,
      issueDate: str(formData.get("issueDate")) ?? todayISO(),
      validUntil: str(formData.get("validUntil")) ?? plusDaysISO(30),
      notes: str(formData.get("notes")),
    })
    .returning();
  revalidatePath("/facturation");
  redirect(`/facturation/devis/${created.id}`);
}

export async function updateQuoteMeta(id: string, formData: FormData) {
  const userId = await getUserId();
  await db
    .update(quotes)
    .set({
      companyId: str(formData.get("companyId")),
      issueDate: str(formData.get("issueDate")) ?? todayISO(),
      validUntil: str(formData.get("validUntil")),
      notes: str(formData.get("notes")),
    })
    .where(and(eq(quotes.id, id), eq(quotes.userId, userId)));
  revalidatePath(`/facturation/devis/${id}`);
}

export async function addQuoteItem(quoteId: string, formData: FormData) {
  await getUserId();
  const description = str(formData.get("description"));
  if (!description) return;
  await db.insert(quoteItems).values({
    quoteId,
    description,
    quantity: str(formData.get("quantity")) ?? "1",
    unitPrice: str(formData.get("unitPrice")) ?? "0",
    vatRate: str(formData.get("vatRate")) ?? "0",
  });
  await recomputeQuoteTotals(quoteId);
  revalidatePath(`/facturation/devis/${quoteId}`);
}

export async function deleteQuoteItem(id: string, quoteId: string) {
  await getUserId();
  await db.delete(quoteItems).where(eq(quoteItems.id, id));
  await recomputeQuoteTotals(quoteId);
  revalidatePath(`/facturation/devis/${quoteId}`);
}

export async function setQuoteStatus(id: string, status: string) {
  const userId = await getUserId();
  await db
    .update(quotes)
    .set({ status: status as never })
    .where(and(eq(quotes.id, id), eq(quotes.userId, userId)));
  revalidatePath(`/facturation/devis/${id}`);
  revalidatePath("/facturation");
}

export async function deleteQuote(id: string) {
  const userId = await getUserId();
  await db.delete(quotes).where(and(eq(quotes.id, id), eq(quotes.userId, userId)));
  revalidatePath("/facturation");
  redirect("/facturation");
}

export async function convertQuoteToInvoice(quoteId: string) {
  const userId = await getUserId();
  const [quote] = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)))
    .limit(1);
  if (!quote) return;

  const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId));
  const [s] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  const number = await nextInvoiceNumber(userId);

  const [invoice] = await db
    .insert(invoices)
    .values({
      userId,
      companyId: quote.companyId,
      projectId: quote.projectId,
      quoteId: quote.id,
      number,
      issueDate: todayISO(),
      dueDate: plusDaysISO(30),
      legalMentions: s?.legalMentions ?? null,
      notes: quote.notes,
    })
    .returning();

  for (const it of items) {
    await db.insert(invoiceItems).values({
      invoiceId: invoice.id,
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      vatRate: it.vatRate,
      position: it.position,
    });
  }
  await recomputeInvoiceTotals(invoice.id);
  await db.update(quotes).set({ status: "accepte" }).where(eq(quotes.id, quoteId));

  revalidatePath("/facturation");
  redirect(`/facturation/factures/${invoice.id}`);
}
