import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, Trash2, Mail, Phone, ArrowLeft } from "lucide-react";
import { getCompany } from "@/lib/data/companies";
import {
  updateCompany,
  deleteCompany,
  createContact,
  deleteContact,
} from "@/app/actions/companies";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { CompanyFormFields } from "@/components/forms/company-form";
import { COMPANY_STATUS, PROJECT_STATUS, INVOICE_STATUS } from "@/lib/labels";
import { formatMoney, formatDate } from "@/lib/utils";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCompany(id);
  if (!data) notFound();
  const { company, contacts, projects, invoices } = data;

  return (
    <div>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clients
      </Link>

      <PageHeader title={company.name} description={company.sector ?? undefined}>
        <Modal
          title="Modifier le client"
          trigger={
            <Button variant="outline">
              <Pencil /> Modifier
            </Button>
          }
        >
          <form action={updateCompany.bind(null, company.id)} className="space-y-4">
            <CompanyFormFields company={company} />
            <div className="flex justify-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Modal>
        <ConfirmForm action={deleteCompany.bind(null, company.id)} message="Supprimer ce client et tout son contenu ?">
          <Button variant="ghost" size="icon" type="submit" title="Supprimer">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </ConfirmForm>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Infos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <Badge variant="secondary">{COMPANY_STATUS[company.status]}</Badge>
            </div>
            {company.siret && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">SIRET</span>
                <span>{company.siret}</span>
              </div>
            )}
            {company.address && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Adresse</span>
                <span className="text-right">{company.address}</span>
              </div>
            )}
            {company.notes && (
              <p className="pt-2 text-muted-foreground whitespace-pre-wrap">{company.notes}</p>
            )}
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Contacts</CardTitle>
            <Modal
              title="Nouveau contact"
              trigger={
                <Button size="sm" variant="outline">
                  <Plus /> Ajouter
                </Button>
              }
            >
              <form action={createContact.bind(null, company.id)} className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input id="fullName" name="fullName" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Input id="role" name="role" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </Modal>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun contact.</p>
            ) : (
              <div className="divide-y">
                {contacts.map((ct) => (
                  <div key={ct.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">{ct.fullName}</p>
                      <p className="text-xs text-muted-foreground">{ct.role}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {ct.email && (
                        <a href={`mailto:${ct.email}`} className="hover:text-foreground" title={ct.email}>
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {ct.phone && (
                        <a href={`tel:${ct.phone}`} className="hover:text-foreground" title={ct.phone}>
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      <ConfirmForm action={deleteContact.bind(null, ct.id, company.id)}>
                        <button type="submit" title="Supprimer" className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </ConfirmForm>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projets */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Projets ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun projet.</p>
          ) : (
            <div className="divide-y">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projets/${p.id}`}
                  className="flex items-center justify-between py-2 hover:opacity-80"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    <Badge variant="secondary">{PROJECT_STATUS[p.status]}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Factures */}
      {invoices.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/facturation/factures/${inv.id}`}
                  className="flex items-center justify-between py-2 text-sm hover:opacity-80"
                >
                  <span>{inv.number}</span>
                  <span className="text-muted-foreground">{formatDate(inv.issueDate)}</span>
                  <span className="font-medium">{formatMoney(inv.total)}</span>
                  <Badge variant="secondary">{INVOICE_STATUS[inv.status]}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
