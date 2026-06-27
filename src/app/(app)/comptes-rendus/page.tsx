import Link from "next/link";
import { Plus, FileText, Sparkles } from "lucide-react";
import { listReports } from "@/lib/data/reports";
import { listCompanies } from "@/lib/data/companies";
import { listProjects } from "@/lib/data/projects";
import { createReport } from "@/app/actions/reports";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { REPORT_TYPE } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default async function ReportsPage() {
  const [reports, companies, projects] = await Promise.all([
    listReports(),
    listCompanies(),
    listProjects(),
  ]);

  const newButton = (
    <Modal title="Nouveau compte rendu" trigger={<Button><Plus /> Nouveau CR</Button>}>
      <form action={createReport} className="space-y-3">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue="cr_reunion">
              {Object.entries(REPORT_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="companyId">Client</Label>
            <Select id="companyId" name="companyId" defaultValue="">
              <option value="">— Aucun —</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="projectId">Projet</Label>
          <Select id="projectId" name="projectId" defaultValue="">
            <option value="">— Aucun —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </div>
        <div className="flex justify-end"><Button type="submit">Créer</Button></div>
      </form>
    </Modal>
  );

  return (
    <div>
      <PageHeader title="Comptes rendus" description="Tes CR et points d'avancement, assistés par l'IA.">
        {newButton}
      </PageHeader>

      {reports.length === 0 ? (
        <EmptyState
          title="Aucun compte rendu"
          description="Crée un CR puis génère-le à partir de tes notes avec l'IA."
          action={newButton}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/comptes-rendus/${r.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {[r.companyName, r.projectName].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="secondary">{REPORT_TYPE[r.type]}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </div>
                  {r.aiGenerated && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                      <Sparkles className="h-3 w-3" /> Généré par IA
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
