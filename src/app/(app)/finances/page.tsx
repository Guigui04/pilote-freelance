import { getFinanceStats } from "@/lib/data/finances";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { formatMoney } from "@/lib/utils";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default async function FinancesPage() {
  const s = await getFinanceStats();

  return (
    <div>
      <PageHeader title="Finances" description={`Vue financière ${s.year}.`} />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Chiffre d'affaires (facturé)" value={formatMoney(s.totalInvoiced, s.currency)} />
        <Stat label="Encaissé" value={formatMoney(s.totalPaid, s.currency)} />
        <Stat label="Reste à encaisser" value={formatMoney(s.totalUnpaid, s.currency)} />
        <Stat
          label="Total HT"
          value={formatMoney(s.totalHT, s.currency)}
          hint={s.vatApplicable ? `TVA collectée : ${formatMoney(s.totalVat, s.currency)}` : "TVA non applicable"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="py-3"><CardTitle className="text-base">Facturé vs encaissé — {s.year}</CardTitle></CardHeader>
          <CardContent>
            <RevenueChart data={s.monthly} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-base">Cotisations URSSAF (estim.)</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base (CA HT)</span>
                <span>{formatMoney(s.totalHT, s.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taux</span>
                <span>{s.urssafRate}%</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>À provisionner</span>
                <span>{formatMoney(s.urssafEstimate, s.currency)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Estimation indicative. Ajuste le taux dans les paramètres selon ton régime.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3"><CardTitle className="text-base">Top clients</CardTitle></CardHeader>
            <CardContent>
              {s.topClients.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée.</p>
              ) : (
                <div className="divide-y">
                  {s.topClients.map((c) => (
                    <div key={c.name} className="flex justify-between py-2 text-sm">
                      <span className="truncate">{c.name}</span>
                      <span className="font-medium">{formatMoney(c.total, s.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
