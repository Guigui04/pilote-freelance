import { db } from "@/lib/db";
import { tasks, projects, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq, ne } from "drizzle-orm";

export type TaskRow = typeof tasks.$inferSelect & {
  projectName: string | null;
  companyName: string | null;
};

export async function listTasks(opts?: { includeDone?: boolean }) {
  const userId = await getUserId();
  const rows = await db
    .select({
      task: tasks,
      projectName: projects.name,
      companyName: companies.name,
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .leftJoin(companies, eq(tasks.companyId, companies.id))
    .where(
      opts?.includeDone
        ? eq(tasks.userId, userId)
        : and(eq(tasks.userId, userId), ne(tasks.status, "termine"))
    )
    .orderBy(desc(tasks.createdAt));

  return rows.map((r) => ({
    ...r.task,
    projectName: r.projectName,
    companyName: r.companyName,
  })) as TaskRow[];
}
