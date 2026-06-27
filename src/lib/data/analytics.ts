import { db } from "@/lib/db";
import { timeEntries, tasks, projects, contentItems, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq, gte, ne } from "drizzle-orm";

export async function getAnalytics() {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Temps par projet (30 j)
  const timeRows = await db
    .select({ entry: timeEntries, projectName: projects.name })
    .from(timeEntries)
    .leftJoin(projects, eq(timeEntries.projectId, projects.id))
    .where(and(eq(timeEntries.userId, userId), gte(timeEntries.startedAt, since)));

  const timeByProject: Record<string, number> = {};
  let billableMin = 0;
  let nonBillableMin = 0;
  for (const r of timeRows) {
    const m = r.entry.durationMinutes ?? 0;
    const key = r.projectName ?? "Sans projet";
    timeByProject[key] = (timeByProject[key] ?? 0) + m;
    if (r.entry.billable) billableMin += m;
    else nonBillableMin += m;
  }
  const timeChart = Object.entries(timeByProject)
    .map(([name, minutes]) => ({ name, heures: Math.round((minutes / 60) * 10) / 10 }))
    .sort((a, b) => b.heures - a.heures)
    .slice(0, 8);

  // Tâches par statut
  const allTasks = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(eq(tasks.userId, userId));
  const tasksByStatus: Record<string, number> = {};
  for (const t of allTasks) tasksByStatus[t.status] = (tasksByStatus[t.status] ?? 0) + 1;

  // Avancement projets actifs
  const activeProjects = await db
    .select({ id: projects.id, name: projects.name, progress: projects.progress })
    .from(projects)
    .where(and(eq(projects.userId, userId), ne(projects.status, "termine")));

  // Contenus par statut
  const allContent = await db
    .select({ status: contentItems.status })
    .from(contentItems)
    .where(eq(contentItems.userId, userId));
  const contentByStatus: Record<string, number> = {};
  for (const c of allContent) contentByStatus[c.status] = (contentByStatus[c.status] ?? 0) + 1;

  // Clients actifs
  const clientRows = await db
    .select({ status: companies.status })
    .from(companies)
    .where(eq(companies.userId, userId));
  const clientsActifs = clientRows.filter((c) => c.status === "actif").length;

  return {
    timeChart,
    billableHours: Math.round((billableMin / 60) * 10) / 10,
    nonBillableHours: Math.round((nonBillableMin / 60) * 10) / 10,
    tasksByStatus,
    activeProjects,
    contentByStatus,
    clientsActifs,
    totalClients: clientRows.length,
  };
}
