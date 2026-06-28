import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/** Astérisque de champ obligatoire, en couleur de marque. */
export function Req() {
  return <span className="ml-0.5 text-primary">*</span>;
}

/** Texte d'aide persistant sous un champ. */
export function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

/** Petit intitulé de section pour grouper les champs. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Champ couleur soigné : pastille cliquable + valeur, dans un conteneur
 * cohérent avec les autres inputs (plutôt que le swatch natif minuscule).
 */
export function ColorField({
  name,
  defaultValue = "#6366f1",
  label = "Couleur",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="flex h-9 items-center gap-2 rounded-lg border border-input bg-card/50 px-2 shadow-sm">
        <input
          id={name}
          name={name}
          type="color"
          defaultValue={defaultValue ?? "#6366f1"}
          className={cn(
            "h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0",
            "[&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0",
            "[&::-webkit-color-swatch-wrapper]:p-0"
          )}
        />
        <span className="text-xs text-muted-foreground">Repère visuel</span>
      </div>
    </div>
  );
}
