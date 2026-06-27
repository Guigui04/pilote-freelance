import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { aiGenerations } from "@/lib/db/schema";

const MODEL = "gemini-2.0-flash";

export function isAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Génère du texte avec Gemini (offre gratuite). Renvoie le texte ou lève une erreur.
 */
export async function generateText(
  prompt: string,
  opts?: { system?: string; temperature?: number }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY manquant.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction:
      opts?.system ??
      "Tu es l'assistant d'un freelance francophone (pilotage digital, IA, marketing). Réponds en français, de façon claire, structurée et actionnable.",
    generationConfig: { temperature: opts?.temperature ?? 0.7 },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function recordGeneration(params: {
  userId: string;
  type: "cr" | "contenu" | "resume" | "reco" | "autre";
  prompt: string;
  output: string;
  contextRef?: string;
}) {
  await db.insert(aiGenerations).values({
    userId: params.userId,
    type: params.type,
    prompt: params.prompt,
    output: params.output,
    contextRef: params.contextRef,
  });
}
