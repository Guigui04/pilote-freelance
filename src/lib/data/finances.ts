import { db } from "@/lib/db";
import { invoices, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq, gte, lte } from "drizzle-orm";
import { getSettings } from "@/lib/settings";

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export async function getFinanceStats(year?: number) {
  const userId = await getUserId();
  const y = year ?? new Date().getFullYear();
  const start = `${y}-01-01`;
  const end = `${y}-12-31`;

  const rows = await db
    .select({
      total: invoices.total,
      paid: invoices.paidAmount,
      vat: invoices.vatAmount,
      subtotal: invoices.subtotal,
      status: invoices.status,
      issueDate: invoices.issueDate,
      companyId: invoices.companyId,
      companyName: companies.name,
    })
    .from(invoices)
    .leftJoin(companies, eq(invoices.companyId, companies.id))
    .where(
      and(
        eq(invoices.userId, userId),
        gte(invoices.issueDate, start),
        lte(invoices.issueDate, end)
      )
    );

  const monthly = MONTH_LABELS.map((label) => ({ label, facture: 0, encaisse: 0 }));
  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalVat = 0;
  let totalHT = 0;
  const byClient: Record<string, number> = {};

  for (const r of rows) {
    const month = r.issueDate ? new Date(r.issueDate).getMonth() : 0;
    const total = Number(r.total);
    const paid = Number(r.paid);
    monthly[month].facture += total;
    monthly[month].encaisse += paid;
    totalInvoiced += total;
    totalPaid += paid;
    totalVat += Number(r.vat);
    totalHT += Number(r.subtotal);
    const key = r.companyName ?? "Sans client";
    byClient[key] = (byClient[key] ?? 0) + total;
  }

  const settings = await getSettings(userId);
  const urssafRate = Number(settings.urssafRate ?? 22);
  const urssafEstimate = (totalHT * urssafRate) / 100;

  const topClients = Object.entries(byClient)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    year: y,
    monthly,
    totalInvoiced,
    totalPaid,
    totalUnpaid: totalInvoiced - totalPaid,
    totalVat,
    totalHT,
    urssafRate,
    urssafEstimate,
    vatApplicable: settings.vatApplicable,
    topClients,
    currency: settings.currency ?? "EUR",
  };
}
