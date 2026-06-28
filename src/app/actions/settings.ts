"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { ensureSettings } from "@/lib/settings";
import { saveIntegrationToken } from "@/lib/integrations";
import { eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function updateSettings(formData: FormData) {
  const userId = await getUserId();
  await ensureSettings(userId);

  const companyInfo = {
    name: str(formData.get("issuerName")) ?? "",
    address: str(formData.get("issuerAddress")) ?? "",
    email: str(formData.get("issuerEmail")) ?? "",
    phone: str(formData.get("issuerPhone")) ?? "",
    siret: str(formData.get("issuerSiret")) ?? "",
  };

  await db
    .update(settings)
    .set({
      currency: str(formData.get("currency")) ?? "EUR",
      defaultDailyRate: str(formData.get("defaultDailyRate")),
      hoursPerDay: str(formData.get("hoursPerDay")) ?? "7",
      fiscalRegime: str(formData.get("fiscalRegime")) ?? "auto_entrepreneur",
      vatApplicable: str(formData.get("vatApplicable")) === "true",
      vatRate: str(formData.get("vatRate")) ?? "0",
      legalMentions: str(formData.get("legalMentions")),
      invoicePrefix: str(formData.get("invoicePrefix")) ?? "F",
      quotePrefix: str(formData.get("quotePrefix")) ?? "D",
      urssafRate: str(formData.get("urssafRate")) ?? "22",
      timezone: str(formData.get("timezone")) ?? "Europe/Paris",
      companyInfo,
    })
    .where(eq(settings.userId, userId));

  revalidatePath("/parametres");
}

export async function saveNotionToken(formData: FormData) {
  const userId = await getUserId();
  const token = str(formData.get("notionToken"));
  if (token) await saveIntegrationToken(userId, "notion", token);
  revalidatePath("/parametres");
}
