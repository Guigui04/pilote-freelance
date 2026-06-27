"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-card/30 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-primary-foreground font-bold shadow-glow">
          P
        </div>
        <span className="text-lg font-bold tracking-tight">PILOTE</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_GROUPS.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ease-glass",
                      active
                        ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary font-semibold ring-1 ring-inset ring-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
