"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

export function ToggleSwitch({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: (next: boolean) => Promise<void> | void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={pending}
      onClick={() => startTransition(() => void onToggle(!checked))}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
