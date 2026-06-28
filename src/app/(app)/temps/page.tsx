import { Plus, Play, Trash2 } from "lucide-react";
import { getRunningEntry, listTimeEntries, getWeekStats } from "@/lib/data/time";
import { listProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/settings";
import { getUserId } from "@/lib/auth";
import { startTimer, stopTimer, addManualEntry, deleteTimeEntry } from "@/app/actions/time";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { TimerWidget } from "@/components/timer-widget";
import { ConfirmForm } from "@/components/confirm-form";
import { formatDuration, formatDateTime, formatMoney, formatDays, minutesToDays } from "@/lib/utils";

export default async function TempsPage() {
  const userId = await getUserId();
  const [running, entries, week, projects, settings] = await Promise.all([
    getRunningEntry(),
    listTimeEntries(50),
    getWeekStats(),
    listProjects(),
    getSettings(userId),
  ]);
  const hoursPerDay = Number(settings.hoursPerDay ?? 7) || 7;

  const projectOptions = (
    <>
      <option value="">— Sans projet —</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </>
  );

  return (
    <div>
      <PageHeader title="Suivi du temps" description="Chronomètre ton activité par projet.">
        <Modal title="Saisie manuelle" trigger={<Button variant="outline"><Plus /> Saisie manuelle</Button>}>
          <form action={addManualEntry} className="space-y-3">
            <div>
              <Label htmlFor="projectId">Projet</Label>
              <Select id="projectId" name="projectId">{projectOptions}</Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startedAt">Début</Label>
                <Input id="startedAt" name="startedAt" type="datetime-local" required />
              </div>
              <div>
                <Label htmlFor="minutes">Durée (min)</Label>
                <Input id="minutes" name="minutes" type="number" min="1" required />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="billable" value="true" defaultChecked /> Facturable
            </label>
            <div className="flex justify-end">
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </Modal>
      </PageHeader>

      {/* Chrono */}
      {running ? (
        <TimerWidget
          startedAt={new Date(running.startedAt).toISOString()}
          description={running.description}
          stop={stopTimer}
        />
      ) : (
        <Card>
          <CardContent className="p-4">
            <form action={startTimer} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="description">Sur quoi travailles-tu ?</Label>
                <Input id="description" name="description" placeholder="Description…" />
              </div>
              <div className="sm:w-56">
                <Label htmlFor="projectId">Projet</Label>
                <Select id="projectId" name="projectId">{projectOptions}</Select>
              </div>
              <Button type="submit"><Play /> Démarrer</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Récap semaine */}
      <div className="mt-4 grid gap-3 grid-cols-3">
        <Card><CardContent className="p-4">
          <p className="text-2xl font-semibold">{formatDuration(week.total)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total (7 jours)</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-semibold">{formatDuration(week.billable)}</p>
          <p className="text-xs text-muted-foreground mt-1">Facturable</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-semibold">{formatDuration(week.nonBillable)}</p>
          <p className="text-xs text-muted-foreground mt-1">Non facturable</p>
        </CardContent></Card>
      </div>

      {/* Liste */}
      <Card className="mt-4">
        <CardHeader className="py-3"><CardTitle className="text-base">Historique</CardTitle></CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune entrée.</p>
          ) : (
            <div className="divide-y">
              {entries.filter((e) => e.endedAt).map((e) => (
                <div key={e.id} className="flex items-center gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{e.description || "Sans description"}</p>
                    <p className="text-xs text-muted-foreground">
                      {[e.projectName, formatDateTime(e.startedAt)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {!e.billable && <Badge variant="secondary">Non fact.</Badge>}
                  {e.dailyRate && e.billable && (
                    <span className="text-xs text-muted-foreground">
                      {formatDays(minutesToDays(e.durationMinutes, hoursPerDay))} ·{" "}
                      {formatMoney(
                        minutesToDays(e.durationMinutes, hoursPerDay) * Number(e.dailyRate)
                      )}
                    </span>
                  )}
                  <span className="text-sm font-medium tabular-nums">
                    {formatDuration(e.durationMinutes)}
                  </span>
                  <ConfirmForm action={deleteTimeEntry.bind(null, e.id)}>
                    <button type="submit" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
