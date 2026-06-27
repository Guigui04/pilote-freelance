import { db } from "@/lib/db";
import { companies, contacts, projects, invoices } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listCompanies() {
  const userId = await getUserId();
  return db
    .select()
    .from(companies)
    .where(eq(companies.userId, userId))
    .orderBy(desc(companies.createdAt));
}

export async function getCompany(id: string) {
  const userId = await getUserId();
  const [company] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.id, id), eq(companies.userId, userId)))
    .limit(1);
  if (!company) return null;

  const companyContacts = await db
    .select()
    .from(contacts)
    .where(eq(contacts.companyId, id));

  const companyProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.companyId, id))
    .orderBy(desc(projects.createdAt));

  const companyInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.companyId, id))
    .orderBy(desc(invoices.createdAt));

  return { company, contacts: companyContacts, projects: companyProjects, invoices: companyInvoices };
}
