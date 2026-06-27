import { Plus, Upload, Link2, FileText, ExternalLink, Trash2 } from "lucide-react";
import { listDocuments } from "@/lib/data/documents";
import { listCompanies } from "@/lib/data/companies";
import { listProjects } from "@/lib/data/projects";
import {
  uploadDocument,
  addLink,
  deleteDocument,
  searchNotionAction,
  listDriveFilesAction,
  attachExternal,
} from "@/app/actions/documents";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { ImportBrowser } from "@/components/import-browser";
import { formatDate } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  file: "Fichier",
  notion: "Notion",
  drive: "Drive",
  sheet: "Sheet",
  link: "Lien",
};

export default async function DocumentsPage() {
  const [docs, companies, projects] = await Promise.all([
    listDocuments(),
    listCompanies(),
    listProjects(),
  ]);

  const contextSelects = (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label htmlFor="companyId">Client</Label>
        <Select id="companyId" name="companyId" defaultValue="">
          <option value="">— Aucun —</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="projectId">Projet</Label>
        <Select id="projectId" name="projectId" defaultValue="">
          <option value="">— Aucun —</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Documents & Ressources" description="Centralise fichiers et liens (Notion, Drive…).">
        <Modal title="Parcourir Notion" trigger={<Button variant="outline">Notion</Button>}>
          <ImportBrowser source="notion" search={searchNotionAction} attach={attachExternal} />
        </Modal>
        <Modal title="Parcourir Google Drive" trigger={<Button variant="outline">Drive</Button>}>
          <ImportBrowser source="drive" search={listDriveFilesAction} attach={attachExternal} />
        </Modal>
        <Modal title="Ajouter un lien" trigger={<Button variant="outline"><Link2 /> Lien</Button>}>
          <form action={addLink} className="space-y-3">
            <div><Label htmlFor="name">Nom *</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="url">URL *</Label><Input id="url" name="url" type="url" required /></div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select id="type" name="type" defaultValue="link">
                <option value="link">Lien</option>
                <option value="notion">Notion</option>
                <option value="drive">Drive</option>
                <option value="sheet">Google Sheet</option>
              </Select>
            </div>
            {contextSelects}
            <div className="flex justify-end"><Button type="submit">Ajouter</Button></div>
          </form>
        </Modal>
        <Modal title="Téléverser un fichier" trigger={<Button><Upload /> Fichier</Button>}>
          <form action={uploadDocument} className="space-y-3">
            <div><Label htmlFor="file">Fichier *</Label><Input id="file" name="file" type="file" required /></div>
            <div><Label htmlFor="name">Nom (optionnel)</Label><Input id="name" name="name" /></div>
            <div><Label htmlFor="category">Catégorie</Label><Input id="category" name="category" placeholder="Brief, livrable, visuel…" /></div>
            {contextSelects}
            <div className="flex justify-end"><Button type="submit">Téléverser</Button></div>
          </form>
        </Modal>
      </PageHeader>

      {docs.length === 0 ? (
        <EmptyState
          title="Aucun document"
          description="Téléverse un fichier ou rattache un lien Notion / Drive."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[d.companyName, d.projectName, d.category].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <Badge variant="secondary">{TYPE_LABEL[d.type] ?? d.type}</Badge>
                  <span className="hidden sm:block text-xs text-muted-foreground">{formatDate(d.createdAt)}</span>
                  {d.url && (
                    <a href={d.url} target="_blank" className="text-muted-foreground hover:text-foreground" title="Ouvrir">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <ConfirmForm action={deleteDocument.bind(null, d.id)}>
                    <button type="submit" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </ConfirmForm>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
