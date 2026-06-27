import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Trash2, FileCheck } from "lucide-react";
import { getQuote } from "@/lib/data/quotes";
import { listCompanies } from "@/lib/data/companies";
import {
  updateQuoteMeta,
  setQuoteStatus,
  addQuoteItem,
  deleteQuoteItem,
  deleteQuote,
  convertQuoteToInvoice,
} from "@/app/actions/quotes";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ConfirmForm } from "@/components/confirm-form";
import { StatusSelect } from "@/components/status-select";
import { LineItems } from "@/components/line-items";
import { QUOTE_STATUS } from "@/lib/labels";
import { formatMoney, formatDate } from "@/lib/utils";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getQuote(id);
  if (!data) notFound();
  const { quote, company, items } = data;
  const companies = await listCompanies();

  return (
    <div>
      <Link href="/facturation" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Facturation
      </Link>

      <PageHeader title={quote.number} description={company?.name ?? undefined}>
        <StatusSelect value={quote.status} options={QUOTE_STATUS} onChange={setQuoteStatus.bind(null, quote.id)} className="w-40" />
        <a href={`/facturation/devis/${quote.id}/pdf`} target="_blank" className={buttonVariants({ variant: "outline" })}>
          <Download /> PDF
        </a>
        <ConfirmForm action={convertQuoteToInvoice.bind(null, quote.id)} message="Convertir ce devis en facture ?">
          <Button type="submit"><FileCheck /> Convertir en facture</Button>
        </ConfirmForm>
        <ConfirmForm action={deleteQuote.bind(null, quote.id)} message="Supprimer ce devis ?">
          <Button variant="ghost" size="icon" type="submit"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </ConfirmForm>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="py-3"><CardTitle className="text-base">Lignes</CardTitle></CardHeader>
          <CardContent>
            <LineItems
              items={items}
              addAction={addQuoteItem.bind(null, quote.id)}
              deleteActionFor={(itemId) => deleteQuoteItem.bind(null, itemId, quote.id)}
            />
            <div className="mt-4 ml-auto w-56 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total HT</span><span>{formatMoney(quote.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">TVA</span><span>{formatMoney(quote.vatAmount)}</span></div>
              <div className="flex justify-between border-t pt-1 font-semibold"><span>Total TTC</span><span>{formatMoney(quote.total)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Détails</CardTitle>
            <Modal title="Modifier le devis" trigger={<Button size="sm" variant="ghost">Modifier</Button>}>
              <form action={updateQuoteMeta.bind(null, quote.id)} className="space-y-3">
                <div>
                  <Label htmlFor="companyId">Client</Label>
                  <Select id="companyId" name="companyId" defaultValue={quote.companyId ?? ""}>
                    <option value="">— Aucun —</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="issueDate">Émission</Label>
                    <Input id="issueDate" name="issueDate" type="date" defaultValue={quote.issueDate ?? ""} />
                  </div>
                  <div>
                    <Label htmlFor="validUntil">Valable jusqu'au</Label>
                    <Input id="validUntil" name="validUntil" type="date" defaultValue={quote.validUntil ?? ""} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" defaultValue={quote.notes ?? ""} />
                </div>
                <div className="flex justify-end"><Button type="submit">Enregistrer</Button></div>
              </form>
            </Modal>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Émission</span><span>{formatDate(quote.issueDate)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Validité</span><span>{formatDate(quote.validUntil)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
