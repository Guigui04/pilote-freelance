"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { contentItems } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function createContent(formData: FormData) {
  const userId = await getUserId();
  const title = str(formData.get("title"));
  if (!title) return;
  const scheduledRaw = str(formData.get("scheduledAt"));
  const [created] = await db
    .insert(contentItems)
    .values({
      userId,
      title,
      companyId: str(formData.get("companyId")),
      platform: str(formData.get("platform")),
      format: str(formData.get("format")),
      status: (str(formData.get("status")) as never) ?? "idee",
      scheduledAt: scheduledRaw ? new Date(scheduledRaw) : null,
      brief: str(formData.get("brief")),
    })
    .returning();
  revalidatePath("/contenus");
  redirect(`/contenus/${created.id}`);
}

export async function updateContent(id: string, formData: FormData) {
  const userId = await getUserId();
  const scheduledRaw = str(formData.get("scheduledAt"));
  await db
    .update(contentItems)
    .set({
      title: str(formData.get("title")) ?? "Sans titre",
      companyId: str(formData.get("companyId")),
      platform: str(formData.get("platform")),
      format: str(formData.get("format")),
      status: (str(formData.get("status")) as never) ?? "idee",
      scheduledAt: scheduledRaw ? new Date(scheduledRaw) : null,
      brief: str(formData.get("brief")),
      body: str(formData.get("body")),
      updatedAt: new Date(),
    })
    .where(and(eq(contentItems.id, id), eq(contentItems.userId, userId)));
  revalidatePath("/contenus");
  revalidatePath(`/contenus/${id}`);
}

export async function updateContentStatus(id: string, status: string) {
  const userId = await getUserId();
  await db
    .update(contentItems)
    .set({ status: status as never, updatedAt: new Date() })
    .where(and(eq(contentItems.id, id), eq(contentItems.userId, userId)));
  revalidatePath("/contenus");
}

export async function deleteContent(id: string) {
  const userId = await getUserId();
  await db.delete(contentItems).where(and(eq(contentItems.id, id), eq(contentItems.userId, userId)));
  revalidatePath("/contenus");
  redirect("/contenus");
}
