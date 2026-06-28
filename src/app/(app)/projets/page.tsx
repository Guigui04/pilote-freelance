import Link from "next/link";
import { Plus } from "lucide-react";
import { listProjects } from "@/lib/data/projects";
import { listCompanies } from "@/lib/data/companies";
import { getSettings } from "@/lib/settings";
import { getUserId } from "@/lib/auth";
import { createProject, updateProjectStatus } from "@/app/actions/projects";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { StatusSelect } from "@/components/status-select";
import { ProjectFormFields } from "@/components/forms/project-form";
import { FormFooter } from "@/components/forms/form-footer";
import { PROJECT_STATUS, PROJECT_STATUS_ORDER } from "@/lib/labels";
import { formatMoney, formatDate } from "@/lib/utils";

export default async function ProjetsPage() {
  const userId = await getUserId();
  const [projects, companies, settings] = await Promise.all([
    listProjects(),
    listCompanies(),
    getSettings(userId),
  ]);
  const companyOptions = companies.map((c) => ({ id: c.id, name: c.name }));

  const newButton = (
    <Modal
      title="Nouveau projet"
      trigger={
        <Button>
          <Plus /> Nouveau projet
        </Button>
      }
    >
      <form action={createProject} className="space-y-5">
        <ProjectFormFields
          companies={companyOptions}
          defaultDailyRate={settings.defaultDailyRate}
        />
        <FormFooter submitLabel="Créer le projet" />
      </form>
    </Modal>
  );

  return (
    <div>
      <PageHeader title="Projets & Roadmaps" description="Pilote tes projets en kanban.">
        {newButton}
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState
          title="Aucun projet"
          description="Crée ton premier projet et rattache-le à un client."
          action={newButton}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PROJECT_STATUS_ORDER.map((status) => {
            const col = projects.filter((p) => p.status === status);
            return (
              <div key={status} className="flex flex-col">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium">{PROJECT_STATUS[status]}</span>
                  <span className="text-xs text-muted-foreground">{col.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {col.map((p) => (
                    <Card key={p.id} className="border-l-4" style={{ borderLeftColor: p.color ?? "#6366f1" }}>
                      <CardContent className="p-3">
                        <Link href={`/projets/${p.id}`} className="block hover:opacity-80">
                          <p className="font-medium text-sm">{p.name}</p>
                          {p.companyName && (
                            <p className="text-xs text-muted-foreground">{p.companyName}</p>
                          )}
                        </Link>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          {p.budget && (
                            <Badge variant="secondary">{formatMoney(p.budget)}</Badge>
                          )}
                          {p.endDate && (
                            <span className="text-xs text-muted-foreground">{formatDate(p.endDate)}</span>
                          )}
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${p.progress ?? 0}%` }}
                          />
                        </div>
                        <div className="mt-2">
                          <StatusSelect
                            value={p.status}
                            options={PROJECT_STATUS}
                            onChange={updateProjectStatus.bind(null, p.id)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
