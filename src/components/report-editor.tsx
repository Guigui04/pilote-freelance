"use client";

import { useState, useTransition } from "react";
import { Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ReportEditor({
  title,
  type,
  initialNotes,
  initialContent,
  generate,
  save,
}: {
  title: string;
  type: string;
  initialNotes: string;
  initialContent: string;
  generate: (notes: string, type: string) => Promise<{ ok: boolean; text?: string; error?: string }>;
  save: (formData: FormData) => Promise<void>;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState(initialContent);
  const [genPending, startGen] = useTransition();
  const [savePending, startSave] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onGenerate() {
    setMsg(null);
    startGen(async () => {
      const r = await generate(notes, type);
      if (r.ok) setContent(r.text ?? "");
      else setMsg(r.error ?? "Erreur");
    });
  }

  function onSave() {
    const fd = new FormData();
    fd.set("content", content);
    fd.set("sourceNotes", notes);
    fd.set("title", title);
    startSave(async () => {
      await save(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label>Notes brutes</Label>
          <Button size="sm" variant="outline" onClick={onGenerate} disabled={genPending}>
            <Sparkles className={genPending ? "animate-pulse" : ""} />
            {genPending ? "Génération…" : "Générer avec l'IA"}
          </Button>
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Colle ici tes notes de réunion / points abordés…"
          className="min-h-[420px]"
        />
        {msg && <p className="mt-1 text-sm text-destructive">{msg}</p>}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label>Compte rendu</Label>
          <Button size="sm" onClick={onSave} disabled={savePending}>
            <Save /> {saved ? "Enregistré ✓" : "Enregistrer"}
          </Button>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Le compte rendu généré apparaîtra ici (modifiable)."
          className="min-h-[420px]"
        />
      </div>
    </div>
  );
}
