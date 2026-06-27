"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reports, contentItems } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { generateText, recordGeneration, isAiConfigured } from "@/lib/ai";
import { and, eq } from "drizzle-orm";

type AiResult = { ok: boolean; text?: string; error?: string };

export async function askAssistant(prompt: string): Promise<AiResult> {
  const userId = await getUserId();
  if (!prompt?.trim()) return { ok: false, error: "Question vide." };
  if (!isAiConfigured()) return { ok: false, error: "IA non configurée (GEMINI_API_KEY)." };
  try {
    const text = await generateText(prompt);
    await recordGeneration({ userId, type: "autre", prompt, output: text });
    return { ok: true, text };
  } catch (e) {
    console.error("[ai] askAssistant", e);
    return { ok: false, error: "Échec de la génération IA." };
  }
}

/** Génère un compte rendu structuré à partir de notes brutes. */
export async function generateReport(reportId: string, notes: string, type: string): Promise<AiResult> {
  const userId = await getUserId();
  if (!isAiConfigured()) return { ok: false, error: "IA non configurée (GEMINI_API_KEY)." };
  if (!notes?.trim()) return { ok: false, error: "Ajoute des notes d'abord." };

  const typeLabel =
    type === "cr_reunion" ? "compte rendu de réunion" : type === "point_hebdo" ? "point d'avancement hebdomadaire" : "bilan";

  const prompt = `À partir des notes brutes ci-dessous, rédige un ${typeLabel} clair et professionnel en français.
Structure attendue : un titre court, un résumé en 2-3 phrases, les points clés (puces), les décisions prises, et les prochaines actions (avec responsables si mentionnés).
Reste fidèle aux notes, n'invente pas.

NOTES :
${notes}`;

  try {
    const text = await generateText(prompt, { temperature: 0.5 });
    await db
      .update(reports)
      .set({ content: text, sourceNotes: notes, aiGenerated: true })
      .where(and(eq(reports.id, reportId), eq(reports.userId, userId)));
    await recordGeneration({ userId, type: "cr", prompt, output: text, contextRef: reportId });
    revalidatePath(`/comptes-rendus/${reportId}`);
    return { ok: true, text };
  } catch (e) {
    console.error("[ai] generateReport", e);
    return { ok: false, error: "Échec de la génération." };
  }
}

/** Génère un contenu (édito, article, post) à partir d'un brief. */
export async function generateContentBody(
  contentId: string,
  brief: string,
  format: string | null,
  platform: string | null
): Promise<AiResult> {
  const userId = await getUserId();
  if (!isAiConfigured()) return { ok: false, error: "IA non configurée (GEMINI_API_KEY)." };
  if (!brief?.trim()) return { ok: false, error: "Ajoute un brief d'abord." };

  const prompt = `Rédige un contenu en français à partir du brief ci-dessous.
${format ? `Format : ${format}.` : ""} ${platform ? `Plateforme : ${platform}.` : ""}
Adapte le ton et la longueur au format et à la plateforme. Propose un texte prêt à publier.

BRIEF :
${brief}`;

  try {
    const text = await generateText(prompt, { temperature: 0.8 });
    await db
      .update(contentItems)
      .set({ body: text, updatedAt: new Date() })
      .where(and(eq(contentItems.id, contentId), eq(contentItems.userId, userId)));
    await recordGeneration({ userId, type: "contenu", prompt, output: text, contextRef: contentId });
    revalidatePath(`/contenus/${contentId}`);
    return { ok: true, text };
  } catch (e) {
    console.error("[ai] generateContentBody", e);
    return { ok: false, error: "Échec de la génération." };
  }
}
