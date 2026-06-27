import { db } from "@/lib/db";
import { invoices, invoiceItems, payments, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listInvoices() {
  const userId = await getUserId();
  return db
    .select({
      id: invoices.id,
      number: invoices.number,
      status: invoices.status,
      issueDate: invoices.issueDate,
      dueDate: invoices.dueDate,
      total: invoices.total,
      paidAmount: invoices.paidAmount,
      companyName: companies.name,
    })
    .from(invoices)
    .leftJoin(companies, eq(invoices.companyId, companies.id))
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.issueDate), desc(invoices.createdAt));
}

export async function getInvoice(id: string) {
  const userId = await getUserId();
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
    .limit(1);
  if (!invoice) return null;

  const company = invoice.companyId
    ? (await db.select().from(companies).where(eq(companies.id, invoice.companyId)).limit(1))[0]
    : null;

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(invoiceItems.position);

  const pays = await db
    .select()
    .from(payments)
    .where(eq(payments.invoiceId, id))
    .orderBy(desc(payments.paidAt));

  return { invoice, company, items, payments: pays };
}
