import { db } from "@/lib/db";
import { projects, companies, tasks, milestones } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listProjects() {
  const userId = await getUserId();
  return db
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      color: projects.color,
      progress: projects.progress,
      endDate: projects.endDate,
      budget: projects.budget,
      companyId: projects.companyId,
      companyName: companies.name,
    })
    .from(projects)
    .leftJoin(companies, eq(projects.companyId, companies.id))
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

export async function getProject(id: string) {
  const userId = await getUserId();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  if (!project) return null;

  const company = project.companyId
    ? (
        await db
          .select()
          .from(companies)
          .where(eq(companies.id, project.companyId))
          .limit(1)
      )[0]
    : null;

  const projectTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, id))
    .orderBy(tasks.position);

  const projectMilestones = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, id))
    .orderBy(milestones.position);

  return { project, company, tasks: projectTasks, milestones: projectMilestones };
}
