"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { calendarEvents, projects } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { getGoogleCalendar } from "@/lib/google";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function createEvent(formData: FormData) {
  const userId = await getUserId();
  const title = str(formData.get("title"));
  const startRaw = str(formData.get("startAt"));
  const endRaw = str(formData.get("endAt"));
  if (!title || !startRaw) return;

  const startAt = new Date(startRaw);
  const endAt = endRaw ? new Date(endRaw) : new Date(startAt.getTime() + 60 * 60000);
  const projectId = str(formData.get("projectId"));

  let companyId: string | null = null;
  let color = str(formData.get("color")) ?? "#6366f1";
  if (projectId) {
    const [p] = await db
      .select({ companyId: projects.companyId, color: projects.color })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    companyId = p?.companyId ?? null;
    if (p?.color) color = p.color;
  }

  // Pousser vers Google Calendar si connecté
  let googleEventId: string | null = null;
  try {
    const cal = await getGoogleCalendar(userId);
    if (cal) {
      const res = await cal.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: title,
          description: str(formData.get("description")) ?? undefined,
          location: str(formData.get("location")) ?? undefined,
          start: { dateTime: startAt.toISOString() },
          end: { dateTime: endAt.toISOString() },
        },
      });
      googleEventId = res.data.id ?? null;
    }
  } catch (e) {
    console.error("[google] insert event échoué", e);
  }

  await db.insert(calendarEvents).values({
    userId,
    title,
    description: str(formData.get("description")),
    location: str(formData.get("location")),
    startAt,
    endAt,
    projectId,
    companyId,
    color,
    googleEventId,
  });

  revalidatePath("/agenda");
}

export async function updateEvent(id: string, formData: FormData) {
  const userId = await getUserId();
  const startRaw = str(formData.get("startAt"));
  const endRaw = str(formData.get("endAt"));
  const startAt = startRaw ? new Date(startRaw) : undefined;
  const endAt = endRaw ? new Date(endRaw) : undefined;

  const [existing] = await db
    .select()
    .from(calendarEvents)
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
    .limit(1);
  if (!existing) return;

  await db
    .update(calendarEvents)
    .set({
      title: str(formData.get("title")) ?? existing.title,
      description: str(formData.get("description")),
      location: str(formData.get("location")),
      startAt: startAt ?? existing.startAt,
      endAt: endAt ?? existing.endAt,
      projectId: str(formData.get("projectId")),
    })
    .where(eq(calendarEvents.id, id));

  if (existing.googleEventId) {
    try {
      const cal = await getGoogleCalendar(userId);
      if (cal) {
        await cal.events.patch({
          calendarId: "primary",
          eventId: existing.googleEventId,
          requestBody: {
            summary: str(formData.get("title")) ?? existing.title,
            description: str(formData.get("description")) ?? undefined,
            location: str(formData.get("location")) ?? undefined,
            start: { dateTime: (startAt ?? existing.startAt).toISOString() },
            end: { dateTime: (endAt ?? existing.endAt).toISOString() },
          },
        });
      }
    } catch (e) {
      console.error("[google] update event échoué", e);
    }
  }

  revalidatePath("/agenda");
}

export async function deleteEvent(id: string) {
  const userId = await getUserId();
  const [existing] = await db
    .select()
    .from(calendarEvents)
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
    .limit(1);
  if (!existing) return;

  if (existing.googleEventId) {
    try {
      const cal = await getGoogleCalendar(userId);
      if (cal)
        await cal.events.delete({
          calendarId: "primary",
          eventId: existing.googleEventId,
        });
    } catch (e) {
      console.error("[google] delete event échoué", e);
    }
  }

  await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
  revalidatePath("/agenda");
}

/**
 * Importe les événements Google Calendar du mois courant (+/- 1 mois) dans la base.
 * Upsert par googleEventId.
 */
export async function syncFromGoogle() {
  const userId = await getUserId();
  const cal = await getGoogleCalendar(userId);
  if (!cal) return { ok: false, error: "Google Calendar non connecté." };

  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

  try {
    const res = await cal.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      maxResults: 250,
      orderBy: "startTime",
    });

    const items = res.data.items ?? [];
    let imported = 0;
    for (const ev of items) {
      if (!ev.id) continue;
      const start = ev.start?.dateTime ?? ev.start?.date;
      const end = ev.end?.dateTime ?? ev.end?.date;
      if (!start) continue;

      const [existing] = await db
        .select({ id: calendarEvents.id })
        .from(calendarEvents)
        .where(
          and(
            eq(calendarEvents.userId, userId),
            eq(calendarEvents.googleEventId, ev.id)
          )
        )
        .limit(1);

      const values = {
        userId,
        title: ev.summary ?? "(sans titre)",
        description: ev.description ?? null,
        location: ev.location ?? null,
        startAt: new Date(start),
        endAt: new Date(end ?? start),
        allDay: !ev.start?.dateTime,
        googleEventId: ev.id,
        color: "#0ea5e9",
      };

      if (existing) {
        await db
          .update(calendarEvents)
          .set(values)
          .where(eq(calendarEvents.id, existing.id));
      } else {
        await db.insert(calendarEvents).values(values);
        imported++;
      }
    }
    revalidatePath("/agenda");
    return { ok: true, imported, total: items.length };
  } catch (e) {
    console.error("[google] sync échoué", e);
    return { ok: false, error: "Échec de la synchronisation." };
  }
}
