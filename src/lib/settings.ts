import { cache } from "react";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type Settings = typeof settings.$inferSelect;

/**
 * Crée la ligne de paramètres par défaut si elle n'existe pas, puis la renvoie.
 */
export async function ensureSettings(userId: string): Promise<Settings> {
  const existing = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(settings)
    .values({ userId })
    .returning();

  return created;
}

/**
 * Lecture des paramètres, mémoïsée par requête (React cache) : plusieurs
 * appels dans un même rendu ne déclenchent qu'une seule requête.
 */
export const getSettings = cache(
  async (userId: string): Promise<Settings> => ensureSettings(userId)
);
