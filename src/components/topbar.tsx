import Link from "next/link";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/30 px-4 backdrop-blur-xl md:px-6">
      <div className="md:hidden flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-primary-foreground text-sm font-bold shadow-glow">
          P
        </div>
        <span className="font-bold">PILOTE</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        {email && (
          <span className="hidden sm:inline text-sm text-muted-foreground">
            {email}
          </span>
        )}
        <ThemeToggle />
        <form action={signOut}>
          <Button variant="ghost" size="icon" title="Se déconnecter" type="submit">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
