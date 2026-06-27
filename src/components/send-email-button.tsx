"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

export function SendEmailButton({
  defaultTo,
  send,
}: {
  defaultTo?: string | null;
  send: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <Modal
      title="Envoyer par e-mail"
      trigger={<Button variant="outline"><Mail /> Envoyer</Button>}
    >
      {(close) => (
        <form
          action={(fd) =>
            startTransition(async () => {
              const r = await send(fd);
              if (r.ok) {
                setMsg(null);
                close();
              } else {
                setMsg(r.error ?? "Erreur");
              }
            })
          }
          className="space-y-3"
        >
          <div>
            <Label htmlFor="to">Destinataire</Label>
            <Input id="to" name="to" type="email" defaultValue={defaultTo ?? ""} required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Message d'accompagnement (optionnel)" />
          </div>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Envoi…" : "Envoyer la facture"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
