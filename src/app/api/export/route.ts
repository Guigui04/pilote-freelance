import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Exporte toutes les données du compte au format JSON. */
export async function GET() {
  const userId = await getUserId();

  const [
    companies, contacts, projects, milestones, tasks, calendarEvents,
    timeEntries, quotes, quoteItems, invoices, invoiceItems, payments,
    contentItems, reports, documents, automations, settings,
  ] = await Promise.all([
    db.select().from(schema.companies).where(eq(schema.companies.userId, userId)),
    db.select().from(schema.contacts).where(eq(schema.contacts.userId, userId)),
    db.select().from(schema.projects).where(eq(schema.projects.userId, userId)),
    db.select().from(schema.milestones).where(eq(schema.milestones.userId, userId)),
    db.select().from(schema.tasks).where(eq(schema.tasks.userId, userId)),
    db.select().from(schema.calendarEvents).where(eq(schema.calendarEvents.userId, userId)),
    db.select().from(schema.timeEntries).where(eq(schema.timeEntries.userId, userId)),
    db.select().from(schema.quotes).where(eq(schema.quotes.userId, userId)),
    db.select().from(schema.quoteItems),
    db.select().from(schema.invoices).where(eq(schema.invoices.userId, userId)),
    db.select().from(schema.invoiceItems),
    db.select().from(schema.payments).where(eq(schema.payments.userId, userId)),
    db.select().from(schema.contentItems).where(eq(schema.contentItems.userId, userId)),
    db.select().from(schema.reports).where(eq(schema.reports.userId, userId)),
    db.select().from(schema.documents).where(eq(schema.documents.userId, userId)),
    db.select().from(schema.automations).where(eq(schema.automations.userId, userId)),
    db.select().from(schema.settings).where(eq(schema.settings.userId, userId)),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    data: {
      companies, contacts, projects, milestones, tasks, calendarEvents,
      timeEntries, quotes, quoteItems, invoices, invoiceItems, payments,
      contentItems, reports, documents, automations, settings,
    },
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="pilote-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
