import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, Check } from "lucide-react";
import { getProject } from "@/lib/data/projects";
import { listCompanies } from "@/lib/data/companies";
import {
  updateProject,
  deleteProject,
  createMilestone,
  toggleMilestone,
  deleteMilestone,
} from "@/app/actions/projects";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { TaskItem } from "@/components/task-item";
import { ProjectFormFields } from "@/components/forms/project-form";
import { TaskFormFields } from "@/components/forms/task-form";
import { PROJECT_STATUS } from "@/lib/labels";
import { formatMoney, formatDate, cn } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProject(id);
  if (!data) notFound();
  const { project, company, tasks, milestones } = data;
  const companies = await listCompanies();
  const companyOptions = companies.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <Link
        href="/projets"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Projets
      </Link>

      <PageHeader
        title={project.name}
        description={company ? company.name : undefined}
      >
        <Modal
          title="Modifier le projet"
          trigger={<Button variant="outline"><Pencil /> Modifier</Button>}
        >
          <form action={updateProject.bind(null, project.id)} className="space-y-4">
            <ProjectFormFields
              project={{
                ...project,
                budget: project.budget ?? undefined,
                hourlyRate: project.hourlyRate ?? undefined,
              }}
              companies={companyOptions}
            />
            <div className="flex justify-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Modal>
        <ConfirmForm action={deleteProject.bind(null, project.id)} message="Supprimer ce projet ?">
          <Button variant="ghost" size="icon" type="submit" title="Supprimer">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </ConfirmForm>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Détails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <Badge variant="secondary">{PROJECT_STATUS[project.status]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avancement</span>
              <span>{project.progress}%</span>
            </div>
            {project.budget && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>{formatMoney(project.budget)}</span>
              </div>
            )}
            {project.hourlyRate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taux horaire</span>
                <span>{formatMoney(project.hourlyRate)}</span>
              </div>
            )}
            {project.endDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Échéance</span>
                <span>{formatDate(project.endDate)}</span>
              </div>
            )}
            {project.description && (
              <p className="pt-2 text-muted-foreground whitespace-pre-wrap">{project.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Roadmap / jalons */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Roadmap / Jalons</CardTitle>
            <Modal
              title="Nouveau jalon"
              trigger={<Button size="sm" variant="outline"><Plus /> Jalon</Button>}
            >
              <form action={createMilestone.bind(null, project.id)} className="space-y-3">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="dueDate">Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </Modal>
          </CardHeader>
          <CardContent>
            {milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun jalon.</p>
            ) : (
              <div className="space-y-2">
                {milestones.map((m) => {
                  const done = m.status === "termine";
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <form action={toggleMilestone.bind(null, m.id, project.id, !done)}>
                        <button
                          type="submit"
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border",
                            done ? "bg-primary border-primary text-primary-foreground" : "border-input"
                          )}
                        >
                          {done && <Check className="h-3.5 w-3.5" />}
                        </button>
                      </form>
                      <span className={cn("flex-1 text-sm", done && "line-through text-muted-foreground")}>
                        {m.title}
                      </span>
                      {m.dueDate && (
                        <span className="text-xs text-muted-foreground">{formatDate(m.dueDate)}</span>
                      )}
                      <ConfirmForm action={deleteMilestone.bind(null, m.id, project.id)}>
                        <button type="submit" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </ConfirmForm>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tâches */}
      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Tâches ({tasks.length})</CardTitle>
          <Modal
            title="Nouvelle tâche"
            trigger={<Button size="sm"><Plus /> Tâche</Button>}
          >
            <form action={createTask} className="space-y-4">
              <TaskFormFields fixedProjectId={project.id} />
              <div className="flex justify-end">
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </Modal>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tâche.</p>
          ) : (
            <div className="divide-y">
              {tasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  toggle={toggleTask.bind(null, t.id)}
                  remove={deleteTask.bind(null, t.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
