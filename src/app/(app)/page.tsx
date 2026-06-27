import Link from "next/link";
import { Building2, FolderKanban, AlertTriangle, CalendarClock, Euro, FileWarning } from "lucide-react";
import { getDashboard } from "@/lib/data/dashboard";
import { toggleTask, deleteTask } from "@/app/actions/tasks";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskItem } from "@/components/task-item";
import { formatMoney, formatDateTime } from "@/lib/utils";

function Stat({
  label,
  value,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  accent?: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function HomePage() {
  const d = await getDashboard();

  return (
    <div>
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de ton activité." />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Clients" value={d.companyCount} icon={Building2} href="/clients" />
        <Stat label="Projets actifs" value={d.activeProjects} icon={FolderKanban} href="/projets" />
        <Stat
          label="Tâches en retard"
          value={d.overdueCount}
          icon={AlertTriangle}
          href="/taches"
          accent={d.overdueCount > 0 ? "bg-destructive/10 text-destructive" : undefined}
        />
        <Stat label="Tâches du jour" value={d.todayCount} icon={CalendarClock} href="/taches" />
        <Stat label="CA du mois" value={formatMoney(d.caMonth)} icon={Euro} href="/finances" />
        <Stat
          label="Impayé"
          value={formatMoney(d.unpaidAmount)}
          icon={FileWarning}
          href="/facturation"
          accent={d.unpaidAmount > 0 ? "bg-amber-500/10 text-amber-600" : undefined}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent>
            {d.todayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun rendez-vous aujourd'hui.</p>
            ) : (
              <div className="divide-y">
                {d.todayEvents.map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-2">
                    <span className="text-sm">{e.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(e.startAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">À traiter aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent className="divide-y pt-0">
            {[...d.overdue, ...d.todayTasks].length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Rien d'urgent. 🎉</p>
            ) : (
              [...d.overdue, ...d.todayTasks].map((t) => (
                <TaskItem
                  key={t.id}
                  task={{ ...t, projectName: null, companyName: null }}
                  toggle={toggleTask.bind(null, t.id)}
                  remove={deleteTask.bind(null, t.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
