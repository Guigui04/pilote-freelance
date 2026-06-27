import { db } from "@/lib/db";
import { calendarEvents, projects, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq, gte, lte } from "drizzle-orm";

export type EventRow = typeof calendarEvents.$inferSelect & {
  projectName: string | null;
  companyName: string | null;
};

export async function listEvents(from: Date, to: Date) {
  const userId = await getUserId();
  const rows = await db
    .select({
      event: calendarEvents,
      projectName: projects.name,
      companyName: companies.name,
    })
    .from(calendarEvents)
    .leftJoin(projects, eq(calendarEvents.projectId, projects.id))
    .leftJoin(companies, eq(calendarEvents.companyId, companies.id))
    .where(
      and(
        eq(calendarEvents.userId, userId),
        gte(calendarEvents.startAt, from),
        lte(calendarEvents.startAt, to)
      )
    )
    .orderBy(calendarEvents.startAt);

  return rows.map((r) => ({
    ...r.event,
    projectName: r.projectName,
    companyName: r.companyName,
  })) as EventRow[];
}
