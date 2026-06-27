import { getAnalytics } from "@/lib/data/analytics";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarMini } from "@/components/charts/bar-mini";
import { TASK_STATUS, CONTENT_STATUS } from "@/lib/labels";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardsPage() {
  const a = await getAnalytics();
  const totalHours = a.billableHours + a.nonBillableHours;
  const billRate = totalHours > 0 ? Math.round((a.billableHours / totalHours) * 100) : 0;

  return (
    <div>
      <PageHeader title="Dashboards & KPI" description="Tes indicateurs d'activité (30 derniers jours)." />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Heures (30 j)" value={`${totalHours} h`} />
        <Stat label="Taux facturable" value={`${billRate}%`} />
        <Stat label="Clients actifs" value={`${a.clientsActifs}/${a.totalClients}`} />
        <Stat label="Projets actifs" value={a.activeProjects.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Temps par projet (30 j)</CardTitle></CardHeader>
          <CardContent>
            {a.timeChart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée de temps.</p>
            ) : (
              <BarMini data={a.timeChart} dataKey="heures" unit=" h" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Avancement des projets</CardTitle></CardHeader>
          <CardContent>
            {a.activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun projet actif.</p>
            ) : (
              <div className="space-y-3">
                {a.activeProjects.map((p) => (
                  <div key={p.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="truncate">{p.name}</span>
                      <span className="text-muted-foreground">{p.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${p.progress ?? 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Tâches par statut</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TASK_STATUS).map(([k, label]) => (
                <div key={k} className="rounded-lg border p-3">
                  <p className="text-2xl font-semibold">{a.tasksByStatus[k] ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Pipeline de contenus</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CONTENT_STATUS).map(([k, label]) => (
                <div key={k} className="rounded-lg border p-3">
                  <p className="text-2xl font-semibold">{a.contentByStatus[k] ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          📊 <strong>Reporting réseaux sociaux & Meta Ads</strong> — module prévu. Il sera activé
          lorsque tu seras présent sur les réseaux (connexion API ou import manuel des données).
        </CardContent>
      </Card>
    </div>
  );
}
