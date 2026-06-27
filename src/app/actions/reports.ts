"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function createReport(formData: FormData) {
  const userId = await getUserId();
  const title = str(formData.get("title"));
  if (!title) return;
  const [created] = await db
    .insert(reports)
    .values({
      userId,
      title,
      type: (str(formData.get("type")) as never) ?? "cr_reunion",
      companyId: str(formData.get("companyId")),
      projectId: str(formData.get("projectId")),
      sourceNotes: str(formData.get("sourceNotes")),
    })
    .returning();
  revalidatePath("/comptes-rendus");
  redirect(`/comptes-rendus/${created.id}`);
}

export async function updateReport(id: string, formData: FormData) {
  const userId = await getUserId();
  await db
    .update(reports)
    .set({
      title: str(formData.get("title")) ?? "Sans titre",
      content: str(formData.get("content")),
      sourceNotes: str(formData.get("sourceNotes")),
    })
    .where(and(eq(reports.id, id), eq(reports.userId, userId)));
  revalidatePath(`/comptes-rendus/${id}`);
}

export async function deleteReport(id: string) {
  const userId = await getUserId();
  await db.delete(reports).where(and(eq(reports.id, id), eq(reports.userId, userId)));
  revalidatePath("/comptes-rendus");
  redirect("/comptes-rendus");
}
