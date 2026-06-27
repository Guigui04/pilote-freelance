"use client";

import { useEffect, useState, useTransition } from "react";
import { Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimerWidget({
  startedAt,
  description,
  projectName,
  stop,
}: {
  startedAt: string;
  description?: string | null;
  projectName?: string | null;
  stop: () => Promise<void> | void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [startedAt]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const fmt = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-between rounded-xl border bg-primary/5 p-4">
      <div>
        <p className="font-mono text-3xl font-semibold tabular-nums">
          {fmt(h)}:{fmt(m)}:{fmt(s)}
        </p>
        <p className="text-sm text-muted-foreground">
          {[projectName, description].filter(Boolean).join(" · ") || "En cours…"}
        </p>
      </div>
      <Button
        variant="destructive"
        disabled={pending}
        onClick={() => startTransition(() => void stop())}
      >
        <Square /> Arrêter
      </Button>
    </div>
  );
}
