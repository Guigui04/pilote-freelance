"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Contexte permettant à des enfants (ex. FormFooter) de fermer le modal sans
// recevoir de fonction en prop — indispensable quand les enfants sont passés
// en JSX depuis un Server Component (les fonctions ne traversent pas RSC).
const ModalCloseContext = React.createContext<(() => void) | null>(null);

export function useModalClose() {
  return React.useContext(ModalCloseContext);
}

type ModalProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  className?: string;
};

export function Modal({ trigger, title, description, children, className }: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  // Portal seulement côté client (document indisponible au rendu serveur).
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      // Verrouille le défilement de la page sous le modal.
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const overlay = open ? (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={(e) => {
        // Ferme uniquement au clic sur le fond (pas sur la carte).
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "glass relative my-8 w-full max-w-lg rounded-2xl p-6 animate-scale-in",
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
        <ModalCloseContext.Provider value={close}>
          <div className={cn(title || description ? "mt-4" : "")}>
            {typeof children === "function" ? children(close) : children}
          </div>
        </ModalCloseContext.Provider>
      </div>
    </div>
  ) : null;

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger}
      </span>
      {/* Rendu dans document.body : le `fixed inset-0` couvre tout le viewport,
          quel que soit un ancêtre avec transform/filter/backdrop-filter. */}
      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
