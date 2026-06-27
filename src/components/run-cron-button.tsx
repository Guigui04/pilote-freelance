"use client";

import { useState, useTransition } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RunCronButton({
  run,
}: {
  run: () => Promise<{ ok: boolean; overdue?: number; recurring?: number }>;
}) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await run();
            setMsg(`${r.overdue ?? 0} facture(s) en retard · ${r.recurring ?? 0} tâche(s) régénérée(s)`);
          })
        }
      >
        <Play className={pending ? "animate-pulse" : ""} /> Lancer maintenant
      </Button>
    </div>
  );
}
