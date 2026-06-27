"use client";

import { useState, useTransition } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Result = { id: string; title: string; url: string };

export function ImportBrowser({
  source,
  search,
  attach,
}: {
  source: "notion" | "drive";
  search: (query: string) => Promise<{ ok: boolean; results: Result[]; error?: string }>;
  attach: (type: "notion" | "drive", name: string, url: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [attached, setAttached] = useState<Set<string>>(new Set());

  function doSearch() {
    setError(null);
    startTransition(async () => {
      const r = await search(query);
      setResults(r.results);
      if (!r.ok) setError(r.error ?? "Erreur");
    });
  }

  function doAttach(item: Result) {
    startTransition(async () => {
      await attach(source, item.title, item.url);
      setAttached((s) => new Set(s).add(item.id));
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder={source === "notion" ? "Rechercher dans Notion…" : "Rechercher dans Drive…"}
        />
        <Button onClick={doSearch} disabled={pending}><Search /></Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="max-h-72 space-y-1 overflow-y-auto">
        {results.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
            <span className="truncate flex-1">{r.title}</span>
            {attached.has(r.id) ? (
              <span className="text-xs text-green-600">Ajouté ✓</span>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => doAttach(r)} disabled={pending}>
                <Plus className="h-4 w-4" /> Attacher
              </Button>
            )}
          </div>
        ))}
        {!pending && results.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">Aucun résultat.</p>
        )}
      </div>
    </div>
  );
}
