"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tasks, projects } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

async function recomputeProgress(projectId: string | null) {
  if (!projectId) return;
  const all = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(eq(tasks.projectId, projectId));
  if (all.length === 0) {
    await db.update(projects).set({ progress: 0 }).where(eq(projects.id, projectId));
    return;
  }
  const done = all.filter((t) => t.status === "termine").length;
  const progress = Math.round((done / all.length) * 100);
  await db.update(projects).set({ progress }).where(eq(projects.id, projectId));
}

export async function createTask(formData: FormData) {
  const userId = await getUserId();
  const title = str(formData.get("title"));
  if (!title) return;

  const projectId = str(formData.get("projectId"));
  const dueRaw = str(formData.get("dueDate"));
  const estRaw = str(formData.get("estimatedMinutes"));

  await db.insert(tasks).values({
    userId,
    title,
    projectId,
    companyId: str(formData.get("companyId")),
    description: str(formData.get("description")),
    type: (str(formData.get("type")) as never) ?? "tache",
    priority: (str(formData.get("priority")) as never) ?? "moyenne",
    status: (str(formData.get("status")) as never) ?? "a_faire",
    dueDate: dueRaw ? new Date(dueRaw) : null,
    estimatedMinutes: estRaw ? parseInt(estRaw, 10) : null,
  });

  await recomputeProgress(projectId);
  revalidatePath("/taches");
  if (projectId) revalidatePath(`/projets/${projectId}`);
}

export async function updateTaskStatus(id: string, status: string) {
  const userId = await getUserId();
  const [updated] = await db
    .update(tasks)
    .set({
      status: status as never,
      completedAt: status === "termine" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ projectId: tasks.projectId });

  await recomputeProgress(updated?.projectId ?? null);
  revalidatePath("/taches");
  if (updated?.projectId) revalidatePath(`/projets/${updated.projectId}`);
}

export async function toggleTask(id: string) {
  const userId = await getUserId();
  const [current] = await db
    .select({ status: tasks.status, projectId: tasks.projectId })
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  if (!current) return;
  const next = current.status === "termine" ? "a_faire" : "termine";
  await db
    .update(tasks)
    .set({
      status: next,
      completedAt: next === "termine" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  await recomputeProgress(current.projectId);
  revalidatePath("/taches");
  if (current.projectId) revalidatePath(`/projets/${current.projectId}`);
}

export async function deleteTask(id: string) {
  const userId = await getUserId();
  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ projectId: tasks.projectId });
  await recomputeProgress(deleted?.projectId ?? null);
  revalidatePath("/taches");
  if (deleted?.projectId) revalidatePath(`/projets/${deleted.projectId}`);
}
