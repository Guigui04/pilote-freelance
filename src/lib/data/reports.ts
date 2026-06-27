import { db } from "@/lib/db";
import { reports, companies, projects } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listReports() {
  const userId = await getUserId();
  return db
    .select({
      id: reports.id,
      title: reports.title,
      type: reports.type,
      createdAt: reports.createdAt,
      aiGenerated: reports.aiGenerated,
      companyName: companies.name,
      projectName: projects.name,
    })
    .from(reports)
    .leftJoin(companies, eq(reports.companyId, companies.id))
    .leftJoin(projects, eq(reports.projectId, projects.id))
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt));
}

export async function getReport(id: string) {
  const userId = await getUserId();
  const [report] = await db
    .select()
    .from(reports)
    .where(and(eq(reports.id, id), eq(reports.userId, userId)))
    .limit(1);
  return report ?? null;
}
