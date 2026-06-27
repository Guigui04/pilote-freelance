import Link from "next/link";
import { Plus, FileText, FileSignature } from "lucide-react";
import { listInvoices } from "@/lib/data/invoices";
import { listQuotes } from "@/lib/data/quotes";
import { listCompanies } from "@/lib/data/companies";
import { createInvoice } from "@/app/actions/invoices";
import { createQuote } from "@/app/actions/quotes";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { INVOICE_STATUS, QUOTE_STATUS } from "@/lib/labels";
import { formatMoney, formatDate } from "@/lib/utils";

const INVOICE_VARIANT: Record<string, "secondary" | "default" | "success" | "warning" | "destructive"> = {
  brouillon: "secondary",
  envoyee: "default",
  payee: "success",
  en_retard: "destructive",
  partiel: "warning",
};
const QUOTE_VARIANT: Record<string, "secondary" | "default" | "success" | "destructive"> = {
  brouillon: "secondary",
  envoye: "default",
  accepte: "success",
  refuse: "destructive",
};

export default async function FacturationPage() {
  const [invoices, quotes, companies] = await Promise.all([
    listInvoices(),
    listQuotes(),
    listCompanies(),
  ]);

  const companySelect = (
    <div>
      <Label htmlFor="companyId">Client</Label>
      <Select id="companyId" name="companyId" defaultValue="">
        <option value="">— Aucun —</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );

  return (
    <div>
      <PageHeader title="Facturation" description="Devis, factures et suivi des paiements.">
        <Modal title="Nouveau devis" trigger={<Button variant="outline"><FileSignature /> Devis</Button>}>
          <form action={createQuote} className="space-y-3">
            {companySelect}
            <div className="flex justify-end"><Button type="submit">Créer le devis</Button></div>
          </form>
        </Modal>
        <Modal title="Nouvelle facture" trigger={<Button><Plus /> Facture</Button>}>
          <form action={createInvoice} className="space-y-3">
            {companySelect}
            <div className="flex justify-end"><Button type="submit">Créer la facture</Button></div>
          </form>
        </Modal>
      </PageHeader>

      <Card className="mb-4">
        <CardHeader className="py-3"><CardTitle className="text-base">Factures</CardTitle></CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune facture.</p>
          ) : (
            <div className="divide-y">
              {invoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/facturation/factures/${inv.id}`}
                  className="flex items-center gap-3 py-2 hover:opacity-80"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm w-32 shrink-0">{inv.number}</span>
                  <span className="flex-1 truncate text-sm text-muted-foreground">{inv.companyName ?? "—"}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(inv.issueDate)}</span>
                  <span className="font-medium text-sm w-24 text-right">{formatMoney(inv.total)}</span>
                  <Badge variant={INVOICE_VARIANT[inv.status]}>{INVOICE_STATUS[inv.status]}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3"><CardTitle className="text-base">Devis</CardTitle></CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun devis.</p>
          ) : (
            <div className="divide-y">
              {quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/facturation/devis/${q.id}`}
                  className="flex items-center gap-3 py-2 hover:opacity-80"
                >
                  <FileSignature className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm w-32 shrink-0">{q.number}</span>
                  <span className="flex-1 truncate text-sm text-muted-foreground">{q.companyName ?? "—"}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(q.issueDate)}</span>
                  <span className="font-medium text-sm w-24 text-right">{formatMoney(q.total)}</span>
                  <Badge variant={QUOTE_VARIANT[q.status]}>{QUOTE_STATUS[q.status]}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
