"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, milestones } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}
function num(v: FormDataEntryValue | null) {
  const s = str(v);
  return s ? s : null;
}

export async function createProject(formData: FormData) {
  const userId = await getUserId();
  const name = str(formData.get("name"));
  if (!name) return;

  const [created] = await db
    .insert(projects)
    .values({
      userId,
      name,
      companyId: str(formData.get("companyId")),
      description: str(formData.get("description")),
      status: (str(formData.get("status")) as never) ?? "a_faire",
      startDate: str(formData.get("startDate")),
      endDate: str(formData.get("endDate")),
      budget: num(formData.get("budget")),
      hourlyRate: num(formData.get("hourlyRate")),
      color: str(formData.get("color")) ?? "#6366f1",
    })
    .returning();

  revalidatePath("/projets");
  redirect(`/projets/${created.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const userId = await getUserId();
  await db
    .update(projects)
    .set({
      name: str(formData.get("name")) ?? "Sans nom",
      companyId: str(formData.get("companyId")),
      description: str(formData.get("description")),
      status: (str(formData.get("status")) as never) ?? "a_faire",
      startDate: str(formData.get("startDate")),
      endDate: str(formData.get("endDate")),
      budget: num(formData.get("budget")),
      hourlyRate: num(formData.get("hourlyRate")),
      color: str(formData.get("color")) ?? "#6366f1",
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));

  revalidatePath("/projets");
  revalidatePath(`/projets/${id}`);
}

export async function updateProjectStatus(id: string, status: string) {
  const userId = await getUserId();
  await db
    .update(projects)
    .set({ status: status as never, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
  revalidatePath("/projets");
}

export async function deleteProject(id: string) {
  const userId = await getUserId();
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
  revalidatePath("/projets");
  redirect("/projets");
}

export async function createMilestone(projectId: string, formData: FormData) {
  const userId = await getUserId();
  const title = str(formData.get("title"));
  if (!title) return;
  await db.insert(milestones).values({
    userId,
    projectId,
    title,
    dueDate: str(formData.get("dueDate")),
  });
  revalidatePath(`/projets/${projectId}`);
}

export async function toggleMilestone(id: string, projectId: string, done: boolean) {
  const userId = await getUserId();
  await db
    .update(milestones)
    .set({ status: done ? "termine" : "a_faire" })
    .where(and(eq(milestones.id, id), eq(milestones.userId, userId)));
  revalidatePath(`/projets/${projectId}`);
}

export async function deleteMilestone(id: string, projectId: string) {
  const userId = await getUserId();
  await db
    .delete(milestones)
    .where(and(eq(milestones.id, id), eq(milestones.userId, userId)));
  revalidatePath(`/projets/${projectId}`);
}
