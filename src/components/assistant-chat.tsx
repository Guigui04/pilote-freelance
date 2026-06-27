"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Send, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Propose-moi 5 idées de posts LinkedIn pour un freelance en pilotage digital.",
  "Rédige un e-mail de relance pour une facture impayée, ton courtois.",
  "Aide-moi à prioriser : liste les critères pour classer mes tâches de la semaine.",
];

export function AssistantChat({
  ask,
}: {
  ask: (prompt: string) => Promise<{ ok: boolean; text?: string; error?: string }>;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(text: string) {
    const prompt = text.trim();
    if (!prompt || pending) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    startTransition(async () => {
      const r = await ask(prompt);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: r.ok ? r.text ?? "" : `⚠️ ${r.error}` },
      ]);
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] rounded-xl border bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-3 font-medium">Assistant IA</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Génère des contenus, des idées, des e-mails, des résumés… Propulsé par Gemini.
            </p>
            <div className="mt-4 flex flex-col gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-lg border p-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`group max-w-[85%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.text}
              {m.role === "assistant" && (
                <button
                  onClick={() => navigator.clipboard.writeText(m.text)}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" /> Copier
                </button>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              L'assistant réfléchit…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            placeholder="Pose ta question… (Entrée pour envoyer, Maj+Entrée pour un saut de ligne)"
            className="min-h-[48px] resize-none"
          />
          <Button onClick={() => submit(input)} disabled={pending} size="icon" className="h-12 w-12 shrink-0">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
