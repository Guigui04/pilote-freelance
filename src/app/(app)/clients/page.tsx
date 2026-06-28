import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { listCompanies } from "@/lib/data/companies";
import { createCompany } from "@/app/actions/companies";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { CompanyFormFields } from "@/components/forms/company-form";
import { FormFooter } from "@/components/forms/form-footer";
import { COMPANY_STATUS } from "@/lib/labels";

export default async function ClientsPage() {
  const companies = await listCompanies();

  const newButton = (
    <Modal
      title="Nouveau client"
      trigger={
        <Button>
          <Plus /> Nouveau client
        </Button>
      }
    >
      <form action={createCompany} className="space-y-5">
        <CompanyFormFields />
        <FormFooter submitLabel="Créer le client" />
      </form>
    </Modal>
  );

  return (
    <div>
      <PageHeader title="Clients & Sociétés" description="Tes clients et leurs contacts.">
        {newButton}
      </PageHeader>

      {companies.length === 0 ? (
        <EmptyState
          title="Aucun client pour l'instant"
          description="Ajoute ta première société pour commencer à organiser tes projets."
          action={newButton}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <Link key={c.id} href={`/clients/${c.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: c.color ?? "#6366f1" }}
                  >
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.name}</p>
                    {c.sector && (
                      <p className="truncate text-sm text-muted-foreground">{c.sector}</p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      {COMPANY_STATUS[c.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
