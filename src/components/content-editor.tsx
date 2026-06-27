"use client";

import { useState, useTransition } from "react";
import { Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_STATUS } from "@/lib/labels";
import { toDatetimeLocal } from "@/lib/utils";

type Content = {
  title: string;
  companyId: string | null;
  platform: string | null;
  format: string | null;
  status: string;
  scheduledAt: Date | string | null;
  brief: string | null;
  body: string | null;
};

export function ContentEditor({
  content,
  companies,
  generate,
  save,
}: {
  content: Content;
  companies: { id: string; name: string }[];
  generate: (
    brief: string,
    format: string | null,
    platform: string | null
  ) => Promise<{ ok: boolean; text?: string; error?: string }>;
  save: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(content.title);
  const [companyId, setCompanyId] = useState(content.companyId ?? "");
  const [platform, setPlatform] = useState(content.platform ?? "");
  const [format, setFormat] = useState(content.format ?? "");
  const [status, setStatus] = useState(content.status);
  const [scheduledAt, setScheduledAt] = useState(toDatetimeLocal(content.scheduledAt));
  const [brief, setBrief] = useState(content.brief ?? "");
  const [body, setBody] = useState(content.body ?? "");
  const [genPending, startGen] = useTransition();
  const [savePending, startSave] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onGenerate() {
    setMsg(null);
    startGen(async () => {
      const r = await generate(brief, format || null, platform || null);
      if (r.ok) setBody(r.text ?? "");
      else setMsg(r.error ?? "Erreur");
    });
  }

  function onSave() {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("companyId", companyId);
    fd.set("platform", platform);
    fd.set("format", format);
    fd.set("status", status);
    fd.set("scheduledAt", scheduledAt);
    fd.set("brief", brief);
    fd.set("body", body);
    startSave(async () => {
      await save(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Méta */}
      <div className="space-y-3">
        <div>
          <Label>Titre</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Client</Label>
          <Select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">— Aucun —</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Plateforme</Label>
            <Input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="LinkedIn…" />
          </div>
          <div>
            <Label>Format</Label>
            <Input value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Post, article…" />
          </div>
        </div>
        <div>
          <Label>Statut</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(CONTENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        </div>
        <div>
          <Label>Programmé le</Label>
          <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        <Button onClick={onSave} disabled={savePending} className="w-full">
          <Save /> {saved ? "Enregistré ✓" : "Enregistrer"}
        </Button>
      </div>

      {/* Brief + corps */}
      <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label>Brief</Label>
            <Button size="sm" variant="outline" onClick={onGenerate} disabled={genPending}>
              <Sparkles className={genPending ? "animate-pulse" : ""} />
              {genPending ? "Génération…" : "Générer"}
            </Button>
          </div>
          <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Décris ce que tu veux produire…" className="min-h-[380px]" />
          {msg && <p className="mt-1 text-sm text-destructive">{msg}</p>}
        </div>
        <div>
          <Label>Contenu</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Le contenu généré apparaîtra ici (modifiable)." className="min-h-[380px]" />
        </div>
      </div>
    </div>
  );
}
