import { Plus } from "lucide-react";
import { listTasks, type TaskRow } from "@/lib/data/tasks";
import { listProjects } from "@/lib/data/projects";
import { listCompanies } from "@/lib/data/companies";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TaskItem } from "@/components/task-item";
import { TaskFormFields } from "@/components/forms/task-form";
import { FormFooter } from "@/components/forms/form-footer";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export default async function TachesPage() {
  const [tasks, projects, companies] = await Promise.all([
    listTasks(),
    listProjects(),
    listCompanies(),
  ]);

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));
  const companyOptions = companies.map((c) => ({ id: c.id, name: c.name }));

  const now = Date.now();
  const todayEnd = endOfToday().getTime();

  const overdue: TaskRow[] = [];
  const today: TaskRow[] = [];
  const upcoming: TaskRow[] = [];
  const noDate: TaskRow[] = [];

  for (const t of tasks) {
    if (!t.dueDate) {
      noDate.push(t);
      continue;
    }
    const due = new Date(t.dueDate).getTime();
    if (due < now && due < startOfToday().getTime()) overdue.push(t);
    else if (due <= todayEnd) today.push(t);
    else upcoming.push(t);
  }
  // tâches du jour déjà passées dans la journée → garder dans "today"

  const newButton = (
    <Modal title="Nouvelle tâche" trigger={<Button><Plus /> Nouvelle tâche</Button>}>
      <form action={createTask} className="space-y-5">
        <TaskFormFields projects={projectOptions} companies={companyOptions} />
        <FormFooter submitLabel="Créer la tâche" />
      </form>
    </Modal>
  );

  const sections: { title: string; items: TaskRow[] }[] = [
    { title: "En retard", items: overdue },
    { title: "Aujourd'hui", items: today },
    { title: "À venir", items: upcoming },
    { title: "Sans échéance", items: noDate },
  ];

  return (
    <div>
      <PageHeader title="Tâches" description="Tout ce qu'il y a à faire, priorisé.">
        {newButton}
      </PageHeader>

      {tasks.length === 0 ? (
        <EmptyState
          title="Aucune tâche en cours"
          description="Ajoute une tâche, seule ou rattachée à un projet."
          action={newButton}
        />
      ) : (
        <div className="space-y-4">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <Card key={s.title}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">
                    {s.title}{" "}
                    <span className="text-muted-foreground font-normal">({s.items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y pt-0">
                  {s.items.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      toggle={toggleTask.bind(null, t.id)}
                      remove={deleteTask.bind(null, t.id)}
                      showContext
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
