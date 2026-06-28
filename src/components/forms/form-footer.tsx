"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalClose } from "@/components/ui/modal";

/**
 * Pied de formulaire collé au bas de la carte du modal : action secondaire
 * "Annuler" (subordonnée) + un unique CTA primaire avec retour de soumission
 * (spinner + désactivation pendant l'envoi). Les marges négatives l'étendent
 * jusqu'aux bords de la carte (padding p-6 du modal). Récupère la fermeture
 * du modal via le contexte (compatible enfants passés depuis un Server Component).
 */
export function FormFooter({
  submitLabel = "Enregistrer",
  pendingLabel = "Enregistrement…",
}: {
  submitLabel?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const close = useModalClose();
  return (
    <div className="-mx-6 -mb-6 mt-1 flex items-center justify-end gap-2 rounded-b-2xl border-t border-border/60 bg-card/40 px-6 py-4">
      {close && (
        <Button type="button" variant="ghost" onClick={close} disabled={pending}>
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={pending} className="min-w-[9rem]">
        {pending && <Loader2 className="animate-spin" />}
        {pending ? pendingLabel : submitLabel}
      </Button>
    </div>
  );
}
