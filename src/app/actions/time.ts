"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { timeEntries, projects } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

async function stopAllRunning(userId: string) {
  const running = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, userId), isNull(timeEntries.endedAt)));
  const now = new Date();
  for (const r of running) {
    const duration = Math.max(
      1,
      Math.round((now.getTime() - new Date(r.startedAt).getTime()) / 60000)
    );
    await db
      .update(timeEntries)
      .set({ endedAt: now, durationMinutes: duration })
      .where(eq(timeEntries.id, r.id));
  }
}

export async function startTimer(formData: FormData) {
  const userId = await getUserId();
  await stopAllRunning(userId);

  const projectId = str(formData.get("projectId"));
  let dailyRate: string | null = null;
  if (projectId) {
    const [p] = await db
      .select({ rate: projects.dailyRate, companyId: projects.companyId })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    dailyRate = p?.rate ?? null;
  }

  await db.insert(timeEntries).values({
    userId,
    projectId,
    description: str(formData.get("description")),
    startedAt: new Date(),
    billable: str(formData.get("billable")) !== "false",
    dailyRate,
  });

  revalidatePath("/temps");
}

export async function stopTimer() {
  const userId = await getUserId();
  await stopAllRunning(userId);
  revalidatePath("/temps");
}

export async function addManualEntry(formData: FormData) {
  const userId = await getUserId();
  const startRaw = str(formData.get("startedAt"));
  const hoursRaw = str(formData.get("hours"));
  if (!startRaw || !hoursRaw) return;

  // Saisie en heures (ex. 2,5) -> stockage en minutes.
  const minutes = Math.max(1, Math.round(parseFloat(hoursRaw.replace(",", ".")) * 60));
  const started = new Date(startRaw);
  const ended = new Date(started.getTime() + minutes * 60000);

  const projectId = str(formData.get("projectId"));
  let dailyRate: string | null = null;
  if (projectId) {
    const [p] = await db
      .select({ rate: projects.dailyRate })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    dailyRate = p?.rate ?? null;
  }

  await db.insert(timeEntries).values({
    userId,
    projectId,
    description: str(formData.get("description")),
    startedAt: started,
    endedAt: ended,
    durationMinutes: minutes,
    billable: str(formData.get("billable")) !== "false",
    dailyRate,
  });

  revalidatePath("/temps");
}

export async function deleteTimeEntry(id: string) {
  const userId = await getUserId();
  await db
    .delete(timeEntries)
    .where(and(eq(timeEntries.id, id), eq(timeEntries.userId, userId)));
  revalidatePath("/temps");
}
