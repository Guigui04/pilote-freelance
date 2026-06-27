"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { automations } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { runAllCronJobs } from "@/lib/cron-jobs";
import { and, desc, eq } from "drizzle-orm";

export async function runCronNow() {
  await getUserId();
  const r = await runAllCronJobs();
  revalidatePath("/automatisations");
  revalidatePath("/facturation");
  revalidatePath("/taches");
  return { ok: true, ...r };
}

export async function listAutomations() {
  const userId = await getUserId();
  return db
    .select()
    .from(automations)
    .where(eq(automations.userId, userId))
    .orderBy(desc(automations.createdAt));
}

export async function createAutomation(formData: FormData) {
  const userId = await getUserId();
  const name = (formData.get("name") as string)?.trim();
  const triggerType = (formData.get("triggerType") as string)?.trim();
  if (!name || !triggerType) return;
  await db.insert(automations).values({ userId, name, triggerType, isActive: true });
  revalidatePath("/automatisations");
}

export async function toggleAutomation(id: string, active: boolean) {
  const userId = await getUserId();
  await db
    .update(automations)
    .set({ isActive: active })
    .where(and(eq(automations.id, id), eq(automations.userId, userId)));
  revalidatePath("/automatisations");
}

export async function deleteAutomation(id: string) {
  const userId = await getUserId();
  await db.delete(automations).where(and(eq(automations.id, id), eq(automations.userId, userId)));
  revalidatePath("/automatisations");
}
