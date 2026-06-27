import { PageHeader } from "@/components/page-header";
import { AssistantChat } from "@/components/assistant-chat";
import { askAssistant } from "@/app/actions/ai";
import { isAiConfigured } from "@/lib/ai";

export default function AssistantPage() {
  const configured = isAiConfigured();
  return (
    <div>
      <PageHeader title="Assistant IA" description="Génère, résume, rédige — avec Gemini." />
      {!configured && (
        <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          La clé <code>GEMINI_API_KEY</code> n'est pas configurée. Ajoute-la dans tes variables d'environnement pour activer l'assistant.
        </div>
      )}
      <AssistantChat ask={askAssistant} />
    </div>
  );
}
