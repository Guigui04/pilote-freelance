import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { MobileNav } from "@/components/mobile-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requireUser() lit l'en-tête posé par le middleware : aucun appel réseau.
  // La ligne de paramètres est créée à la demande par getSettings().
  const user = await requireUser();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar email={user.email} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
