import { db } from "@/lib/db";
import { integrations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type Provider = "google" | "notion" | "gemini" | "resend";

export async function getIntegration(userId: string, provider: Provider) {
  const rows = await db
    .select()
    .from(integrations)
    .where(
      and(eq(integrations.userId, userId), eq(integrations.provider, provider))
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function saveGoogleTokens(
  userId: string,
  tokens: { accessToken: string; refreshToken: string | null; expiresAt?: Date }
) {
  const existing = await getIntegration(userId, "google");

  if (existing) {
    await db
      .update(integrations)
      .set({
        accessToken: tokens.accessToken,
        // Ne pas écraser un refresh token existant par null
        refreshToken: tokens.refreshToken ?? existing.refreshToken,
        expiresAt: tokens.expiresAt ?? null,
      })
      .where(eq(integrations.id, existing.id));
  } else {
    await db.insert(integrations).values({
      userId,
      provider: "google",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt ?? null,
    });
  }
}

export async function saveIntegrationToken(
  userId: string,
  provider: Provider,
  accessToken: string,
  metadata?: Record<string, unknown>
) {
  const existing = await getIntegration(userId, provider);
  if (existing) {
    await db
      .update(integrations)
      .set({ accessToken, metadata: metadata ?? existing.metadata })
      .where(eq(integrations.id, existing.id));
  } else {
    await db
      .insert(integrations)
      .values({ userId, provider, accessToken, metadata });
  }
}
