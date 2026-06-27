"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SyncButton({
  sync,
}: {
  sync: () => Promise<{ ok: boolean; imported?: number; error?: string }>;
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
            const r = await sync();
            setMsg(
              r.ok
                ? `${r.imported ?? 0} importé(s)`
                : r.error ?? "Erreur"
            );
          })
        }
      >
        <RefreshCw className={pending ? "animate-spin" : ""} /> Synchroniser Google
      </Button>
    </div>
  );
}
