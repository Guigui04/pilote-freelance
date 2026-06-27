import Link from "next/link";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/40 px-4 md:px-6">
      <div className="md:hidden flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          P
        </div>
        <span className="font-semibold">PILOTE</span>
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
