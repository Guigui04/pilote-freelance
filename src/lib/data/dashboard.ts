import { db } from "@/lib/db";
import { companies, projects, tasks, invoices, calendarEvents } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq, ne, gte, lte, sql } from "drizzle-orm";

export async function getDashboard() {
  const userId = await getUserId();

  const now = new Date();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [companyCount] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(companies)
    .where(eq(companies.userId, userId));

  const [activeProjects] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(projects)
    .where(and(eq(projects.userId, userId), ne(projects.status, "termine")));

  const openTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), ne(tasks.status, "termine")))
    .orderBy(tasks.dueDate);

  const overdue = openTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate).getTime() < startToday.getTime()
  );
  const todayTasks = openTasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate).getTime() >= startToday.getTime() &&
      new Date(t.dueDate).getTime() <= endToday.getTime()
  );

  // CA du mois (factures émises ce mois)
  const monthInvoices = await db
    .select({ total: invoices.total, status: invoices.status, paid: invoices.paidAmount })
    .from(invoices)
    .where(
      and(
        eq(invoices.userId, userId),
        gte(invoices.issueDate, startMonth.toISOString().slice(0, 10)),
        lte(invoices.issueDate, endMonth.toISOString().slice(0, 10))
      )
    );

  const caMonth = monthInvoices.reduce((s, i) => s + Number(i.total), 0);

  const unpaidInvoices = await db
    .select({ total: invoices.total, paid: invoices.paidAmount })
    .from(invoices)
    .where(and(eq(invoices.userId, userId), ne(invoices.status, "payee")));

  const unpaidAmount = unpaidInvoices.reduce(
    (s, i) => s + (Number(i.total) - Number(i.paid)),
    0
  );

  // RDV du jour
  const todayEvents = await db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.userId, userId),
        gte(calendarEvents.startAt, startToday),
        lte(calendarEvents.startAt, endToday)
      )
    )
    .orderBy(calendarEvents.startAt);

  return {
    companyCount: companyCount?.c ?? 0,
    activeProjects: activeProjects?.c ?? 0,
    overdueCount: overdue.length,
    todayCount: todayTasks.length,
    caMonth,
    unpaidAmount,
    todayTasks,
    overdue,
    todayEvents,
  };
}
