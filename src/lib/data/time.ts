import { db } from "@/lib/db";
import { timeEntries, projects, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq, isNull, gte } from "drizzle-orm";

export type TimeEntryRow = typeof timeEntries.$inferSelect & {
  projectName: string | null;
  companyName: string | null;
};

export async function getRunningEntry() {
  const userId = await getUserId();
  const [running] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, userId), isNull(timeEntries.endedAt)))
    .orderBy(desc(timeEntries.startedAt))
    .limit(1);
  return running ?? null;
}

export async function listTimeEntries(limit = 100) {
  const userId = await getUserId();
  const rows = await db
    .select({
      entry: timeEntries,
      projectName: projects.name,
      companyName: companies.name,
    })
    .from(timeEntries)
    .leftJoin(projects, eq(timeEntries.projectId, projects.id))
    .leftJoin(companies, eq(timeEntries.companyId, companies.id))
    .where(eq(timeEntries.userId, userId))
    .orderBy(desc(timeEntries.startedAt))
    .limit(limit);

  return rows.map((r) => ({
    ...r.entry,
    projectName: r.projectName,
    companyName: r.companyName,
  })) as TimeEntryRow[];
}

export async function getWeekStats() {
  const userId = await getUserId();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      entry: timeEntries,
      projectName: projects.name,
    })
    .from(timeEntries)
    .leftJoin(projects, eq(timeEntries.projectId, projects.id))
    .where(and(eq(timeEntries.userId, userId), gte(timeEntries.startedAt, start)));

  let total = 0;
  let billable = 0;
  const byProject: Record<string, number> = {};
  for (const r of rows) {
    const m = r.entry.durationMinutes ?? 0;
    total += m;
    if (r.entry.billable) billable += m;
    const key = r.projectName ?? "Sans projet";
    byProject[key] = (byProject[key] ?? 0) + m;
  }
  return { total, billable, nonBillable: total - billable, byProject };
}
