import { Plus, Zap, Trash2 } from "lucide-react";
import {
  listAutomations,
  createAutomation,
  toggleAutomation,
  deleteAutomation,
  runCronNow,
} from "@/app/actions/automations";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { ToggleSwitch } from "@/components/toggle-switch";
import { RunCronButton } from "@/components/run-cron-button";
import { formatDateTime } from "@/lib/utils";

const TRIGGERS: Record<string, string> = {
  facture_en_retard: "Marquer les factures échues en retard",
  tache_recurrente: "Régénérer les tâches récurrentes",
  rappel_deadline: "Rappel des échéances proches",
  rappel_impaye: "Rappel des factures impayées",
};

export default async function AutomatisationsPage() {
  const automations = await listAutomations();

  return (
    <div>
      <PageHeader title="Automatisations" description="Tâches automatiques exécutées chaque jour.">
        <RunCronButton run={runCronNow} />
        <Modal title="Nouvelle automatisation" trigger={<Button><Plus /> Nouvelle règle</Button>}>
          <form action={createAutomation} className="space-y-3">
            <div><Label htmlFor="name">Nom *</Label><Input id="name" name="name" required /></div>
            <div>
              <Label htmlFor="triggerType">Déclencheur</Label>
              <Select id="triggerType" name="triggerType" defaultValue="facture_en_retard">
                {Object.entries(TRIGGERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
            <div className="flex justify-end"><Button type="submit">Créer</Button></div>
          </form>
        </Modal>
      </PageHeader>

      <Card className="mb-4 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          ⚙️ Deux automatisations intégrées tournent chaque matin (7 h) via <strong>Vercel Cron</strong> :
          passage des factures échues en « en retard » et régénération des tâches récurrentes terminées.
          Utilise « Lancer maintenant » pour les exécuter à la demande.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3"><CardTitle className="text-base">Mes règles</CardTitle></CardHeader>
        <CardContent>
          {automations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune règle personnalisée.</p>
          ) : (
            <div className="divide-y">
              {automations.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {TRIGGERS[a.triggerType] ?? a.triggerType}
                      {a.lastRunAt && ` · dernier run ${formatDateTime(a.lastRunAt)}`}
                    </p>
                  </div>
                  <ToggleSwitch checked={!!a.isActive} onToggle={toggleAutomation.bind(null, a.id)} />
                  <ConfirmForm action={deleteAutomation.bind(null, a.id)}>
                    <button type="submit" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </ConfirmForm>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
