import { db } from "@/lib/db";
import {
  invoices,
  invoiceItems,
  quotes,
  quoteItems,
  settings,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function recomputeInvoiceTotals(invoiceId: string) {
  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId));

  let subtotal = 0;
  let vat = 0;
  for (const it of items) {
    const line = Number(it.quantity) * Number(it.unitPrice);
    subtotal += line;
    vat += line * (Number(it.vatRate) / 100);
  }
  const total = subtotal + vat;

  await db
    .update(invoices)
    .set({
      subtotal: round2(subtotal).toString(),
      vatAmount: round2(vat).toString(),
      total: round2(total).toString(),
    })
    .where(eq(invoices.id, invoiceId));
}

export async function recomputeQuoteTotals(quoteId: string) {
  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId));

  let subtotal = 0;
  let vat = 0;
  for (const it of items) {
    const line = Number(it.quantity) * Number(it.unitPrice);
    subtotal += line;
    vat += line * (Number(it.vatRate) / 100);
  }
  const total = subtotal + vat;

  await db
    .update(quotes)
    .set({
      subtotal: round2(subtotal).toString(),
      vatAmount: round2(vat).toString(),
      total: round2(total).toString(),
    })
    .where(eq(quotes.id, quoteId));
}

/** Génère le prochain numéro de facture et incrémente le compteur. */
export async function nextInvoiceNumber(userId: string) {
  const [s] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  const prefix = s?.invoicePrefix ?? "F";
  const counter = s?.nextInvoiceNumber ?? 1;
  const year = new Date().getFullYear();
  const number = `${prefix}-${year}-${counter.toString().padStart(4, "0")}`;
  await db
    .update(settings)
    .set({ nextInvoiceNumber: counter + 1 })
    .where(eq(settings.userId, userId));
  return number;
}

export async function nextQuoteNumber(userId: string) {
  const [s] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  const prefix = s?.quotePrefix ?? "D";
  const counter = s?.nextQuoteNumber ?? 1;
  const year = new Date().getFullYear();
  const number = `${prefix}-${year}-${counter.toString().padStart(4, "0")}`;
  await db
    .update(settings)
    .set({ nextQuoteNumber: counter + 1 })
    .where(eq(settings.userId, userId));
  return number;
}

/** Met à jour le statut d'une facture en fonction du montant payé. */
export async function refreshInvoiceStatus(invoiceId: string) {
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  if (!inv) return;
  const total = Number(inv.total);
  const paid = Number(inv.paidAmount);

  let status = inv.status;
  if (paid >= total && total > 0) status = "payee";
  else if (paid > 0) status = "partiel";
  else if (inv.status === "payee" || inv.status === "partiel") status = "envoyee";

  // Retard si échéance dépassée et non payée
  if (status !== "payee" && inv.dueDate && new Date(inv.dueDate) < new Date()) {
    status = "en_retard";
  }

  await db.update(invoices).set({ status }).where(eq(invoices.id, invoiceId));
}
