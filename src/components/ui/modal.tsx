"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  className?: string;
};

export function Modal({ trigger, title, description, children, className }: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger}
      </span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
          <div
            className={cn(
              "relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg my-8",
              className
            )}
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            <div className={cn(title || description ? "mt-4" : "")}>
              {typeof children === "function" ? children(close) : children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
