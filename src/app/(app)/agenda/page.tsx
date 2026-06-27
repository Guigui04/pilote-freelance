import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { listEvents } from "@/lib/data/events";
import { listProjects } from "@/lib/data/projects";
import { createEvent, updateEvent, deleteEvent, syncFromGoogle } from "@/app/actions/events";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { SyncButton } from "@/components/sync-button";
import { EventFormFields } from "@/components/forms/event-form";
import { cn, toDatetimeLocal, formatTime } from "@/lib/utils";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  if (m && /^\d{4}-\d{2}$/.test(m)) {
    const [y, mo] = m.split("-").map(Number);
    year = y;
    month = mo - 1;
  }

  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(firstOfMonth);
  const offset = (firstOfMonth.getDay() + 6) % 7; // lundi = 0
  gridStart.setDate(firstOfMonth.getDate() - offset);
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridStart.getDate() + 42);

  const [events, projects] = await Promise.all([
    listEvents(gridStart, gridEnd),
    listProjects(),
  ]);
  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));

  const prevM = new Date(year, month - 1, 1);
  const nextM = new Date(year, month + 1, 1);
  const fmtM = (d: Date) => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  const eventsByDay = new Map<string, typeof events>();
  for (const e of events) {
    const key = new Date(e.startAt).toDateString();
    const arr = eventsByDay.get(key) ?? [];
    arr.push(e);
    eventsByDay.set(key, arr);
  }

  const todayKey = new Date().toDateString();

  const newButton = (
    <Modal title="Nouvel événement" trigger={<Button><Plus /> Événement</Button>}>
      <form action={createEvent} className="space-y-3">
        <EventFormFields projects={projectOptions} defaultDate={toDatetimeLocal(new Date(year, month, now.getDate(), 9, 0))} />
        <div className="flex justify-end"><Button type="submit">Créer</Button></div>
      </form>
    </Modal>
  );

  return (
    <div>
      <PageHeader title="Agenda" description="Planifie tes rendez-vous et blocs de travail.">
        <SyncButton sync={syncFromGoogle} />
        {newButton}
      </PageHeader>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium capitalize">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <Link href={`/agenda?m=${fmtM(prevM)}`} className="rounded-md border p-1.5 hover:bg-accent">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href="/agenda" className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Aujourd'hui
          </Link>
          <Link href={`/agenda?m=${fmtM(nextM)}`} className="rounded-md border p-1.5 hover:bg-accent">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border text-sm">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-card px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = day.toDateString();
          const inMonth = day.getMonth() === month;
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={cn(
                "min-h-[96px] bg-card p-1.5 align-top",
                !inMonth && "bg-muted/40 text-muted-foreground"
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    isToday && "bg-primary text-primary-foreground font-medium"
                  )}
                >
                  {day.getDate()}
                </span>
                <Modal
                  title="Nouvel événement"
                  trigger={
                    <button className="text-muted-foreground opacity-0 hover:text-foreground hover:opacity-100">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  }
                >
                  <form action={createEvent} className="space-y-3">
                    <EventFormFields
                      projects={projectOptions}
                      defaultDate={toDatetimeLocal(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 0))}
                    />
                    <div className="flex justify-end"><Button type="submit">Créer</Button></div>
                  </form>
                </Modal>
              </div>
              <div className="space-y-1">
                {dayEvents.map((e) => (
                  <Modal
                    key={e.id}
                    title="Modifier l'événement"
                    trigger={
                      <button
                        className="block w-full truncate rounded px-1.5 py-0.5 text-left text-xs text-white"
                        style={{ backgroundColor: e.color ?? "#6366f1" }}
                      >
                        {!e.allDay && <span className="opacity-80">{formatTime(e.startAt)} </span>}
                        {e.title}
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      <form action={updateEvent.bind(null, e.id)} className="space-y-3" id={`evform-${e.id}`}>
                        <EventFormFields
                          projects={projectOptions}
                          event={{
                            title: e.title,
                            description: e.description,
                            location: e.location,
                            projectId: e.projectId,
                            startAt: toDatetimeLocal(e.startAt),
                            endAt: toDatetimeLocal(e.endAt),
                          }}
                        />
                        <div className="flex justify-end">
                          <Button type="submit">Enregistrer</Button>
                        </div>
                      </form>
                      <ConfirmForm action={deleteEvent.bind(null, e.id)} message="Supprimer cet événement ?" className="border-t pt-3">
                        <Button type="submit" variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" /> Supprimer
                        </Button>
                      </ConfirmForm>
                    </div>
                  </Modal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
