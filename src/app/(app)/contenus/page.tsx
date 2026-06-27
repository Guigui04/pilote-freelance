import Link from "next/link";
import { Plus } from "lucide-react";
import { listContent } from "@/lib/data/content";
import { listCompanies } from "@/lib/data/companies";
import { createContent, updateContentStatus } from "@/app/actions/content";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { StatusSelect } from "@/components/status-select";
import { CONTENT_STATUS, CONTENT_STATUS_ORDER } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";

export default async function ContenusPage() {
  const [items, companies] = await Promise.all([listContent(), listCompanies()]);

  const newButton = (
    <Modal title="Nouveau contenu" trigger={<Button><Plus /> Nouveau contenu</Button>}>
      <form action={createContent} className="space-y-3">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="platform">Plateforme</Label>
            <Input id="platform" name="platform" placeholder="LinkedIn, Instagram…" />
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Input id="format" name="format" placeholder="Post, article, vidéo…" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="companyId">Client</Label>
            <Select id="companyId" name="companyId" defaultValue="">
              <option value="">— Aucun —</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledAt">Programmé le</Label>
            <Input id="scheduledAt" name="scheduledAt" type="datetime-local" />
          </div>
        </div>
        <div>
          <Label htmlFor="brief">Brief</Label>
          <Textarea id="brief" name="brief" />
        </div>
        <div className="flex justify-end"><Button type="submit">Créer</Button></div>
      </form>
    </Modal>
  );

  return (
    <div>
      <PageHeader title="Calendrier éditorial" description="Planifie et produis tes contenus.">
        {newButton}
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun contenu"
          description="Crée une idée de contenu et génère-la avec l'IA."
          action={newButton}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {CONTENT_STATUS_ORDER.map((status) => {
            const col = items.filter((i) => i.status === status);
            return (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium">{CONTENT_STATUS[status]}</span>
                  <span className="text-xs text-muted-foreground">{col.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {col.map((i) => (
                    <Card key={i.id}>
                      <CardContent className="p-3">
                        <Link href={`/contenus/${i.id}`} className="block hover:opacity-80">
                          <p className="text-sm font-medium">{i.title}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {i.platform && <Badge variant="secondary">{i.platform}</Badge>}
                            {i.format && <Badge variant="outline">{i.format}</Badge>}
                          </div>
                          {i.scheduledAt && (
                            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(i.scheduledAt)}</p>
                          )}
                        </Link>
                        <div className="mt-2">
                          <StatusSelect
                            value={i.status}
                            options={CONTENT_STATUS}
                            onChange={updateContentStatus.bind(null, i.id)}
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
