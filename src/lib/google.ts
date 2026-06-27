import { google } from "googleapis";
import { db } from "@/lib/db";
import { integrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getIntegration } from "@/lib/integrations";

/**
 * Construit un client OAuth2 Google pour l'utilisateur, à partir des jetons
 * stockés. Rafraîchit automatiquement l'access token si un refresh token existe.
 * Renvoie null si aucune intégration Google n'est connectée.
 */
export async function getGoogleClient(userId: string) {
  const integ = await getIntegration(userId, "google");
  if (!integ || !integ.accessToken) return null;

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2.setCredentials({
    access_token: integ.accessToken,
    refresh_token: integ.refreshToken ?? undefined,
    expiry_date: integ.expiresAt ? new Date(integ.expiresAt).getTime() : undefined,
  });

  // Persiste les jetons rafraîchis
  oauth2.on("tokens", async (tokens) => {
    await db
      .update(integrations)
      .set({
        accessToken: tokens.access_token ?? integ.accessToken,
        refreshToken: tokens.refresh_token ?? integ.refreshToken,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : integ.expiresAt,
      })
      .where(eq(integrations.id, integ.id));
  });

  return oauth2;
}

export async function getGoogleCalendar(userId: string) {
  const auth = await getGoogleClient(userId);
  if (!auth) return null;
  return google.calendar({ version: "v3", auth });
}

export async function getGoogleDrive(userId: string) {
  const auth = await getGoogleClient(userId);
  if (!auth) return null;
  return google.drive({ version: "v3", auth });
}

export async function getGoogleSheets(userId: string) {
  const auth = await getGoogleClient(userId);
  if (!auth) return null;
  return google.sheets({ version: "v4", auth });
}
