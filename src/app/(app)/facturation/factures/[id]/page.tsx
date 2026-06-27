import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Trash2, Timer } from "lucide-react";
import { getInvoice } from "@/lib/data/invoices";
import { listCompanies } from "@/lib/data/companies";
import { listProjects } from "@/lib/data/projects";
import { getCompany } from "@/lib/data/companies";
import {
  updateInvoiceMeta,
  setInvoiceStatus,
  addInvoiceItem,
  deleteInvoiceItem,
  addPayment,
  deletePayment,
  deleteInvoice,
  billTimeEntriesForm,
} from "@/app/actions/invoices";
import { sendInvoiceByEmail } from "@/app/actions/email";
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
import { SendEmailButton } from "@/components/send-email-button";
import { LineItems } from "@/components/line-items";
import { INVOICE_STATUS } from "@/lib/labels";
import { formatMoney, formatDate } from "@/lib/utils";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getInvoice(id);
  if (!data) notFound();
  const { invoice, company, items, payments } = data;

  const [companies, projects] = await Promise.all([listCompanies(), listProjects()]);

  // E-mail par défaut : premier contact du client
  let defaultEmail: string | null = null;
  if (invoice.companyId) {
    const cd = await getCompany(invoice.companyId);
    defaultEmail = cd?.contacts.find((c) => c.email)?.email ?? null;
  }

  const remaining = Number(invoice.total) - Number(invoice.paidAmount);

  return (
    <div>
      <Link href="/facturation" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Facturation
      </Link>

      <PageHeader title={invoice.number} description={company?.name ?? undefined}>
        <StatusSelect
          value={invoice.status}
          options={INVOICE_STATUS}
          onChange={setInvoiceStatus.bind(null, invoice.id)}
          className="w-40"
        />
        <a href={`/facturation/factures/${invoice.id}/pdf`} target="_blank" className={buttonVariants({ variant: "outline" })}>
          <Download /> PDF
        </a>
        <SendEmailButton defaultTo={defaultEmail} send={sendInvoiceByEmail.bind(null, invoice.id)} />
        <ConfirmForm action={deleteInvoice.bind(null, invoice.id)} message="Supprimer cette facture ?">
          <Button variant="ghost" size="icon" type="submit"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </ConfirmForm>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Lignes */}
        <Card className="lg:col-span-2">
          <CardHeader className="py-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Lignes</CardTitle>
            {projects.length > 0 && (
              <Modal title="Facturer du temps" trigger={<Button size="sm" variant="outline"><Timer /> Facturer le temps</Button>}>
                <form action={billTimeEntriesForm.bind(null, invoice.id)} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ajoute le temps facturable non encore facturé d'un projet.
                  </p>
                  <div>
                    <Label htmlFor="projectId">Projet</Label>
                    <Select id="projectId" name="projectId" required>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex justify-end"><Button type="submit">Ajouter</Button></div>
                </form>
              </Modal>
            )}
          </CardHeader>
          <CardContent>
            <LineItems
              items={items}
              addAction={addInvoiceItem.bind(null, invoice.id)}
              deleteActionFor={(itemId) => deleteInvoiceItem.bind(null, itemId, invoice.id)}
            />
            <div className="mt-4 ml-auto w-56 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total HT</span><span>{formatMoney(invoice.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">TVA</span><span>{formatMoney(invoice.vatAmount)}</span></div>
              <div className="flex justify-between border-t pt-1 font-semibold"><span>Total TTC</span><span>{formatMoney(invoice.total)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Payé</span><span>{formatMoney(invoice.paidAmount)}</span></div>
              {remaining > 0 && (
                <div className="flex justify-between font-medium text-amber-600"><span>Reste dû</span><span>{formatMoney(remaining)}</span></div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Détails */}
          <Card>
            <CardHeader className="py-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Détails</CardTitle>
              <Modal title="Modifier la facture" trigger={<Button size="sm" variant="ghost">Modifier</Button>}>
                <form action={updateInvoiceMeta.bind(null, invoice.id)} className="space-y-3">
                  <div>
                    <Label htmlFor="companyId">Client</Label>
                    <Select id="companyId" name="companyId" defaultValue={invoice.companyId ?? ""}>
                      <option value="">— Aucun —</option>
                      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="issueDate">Émission</Label>
                      <Input id="issueDate" name="issueDate" type="date" defaultValue={invoice.issueDate ?? ""} />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Échéance</Label>
                      <Input id="dueDate" name="dueDate" type="date" defaultValue={invoice.dueDate ?? ""} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="legalMentions">Mentions légales</Label>
                    <Textarea id="legalMentions" name="legalMentions" defaultValue={invoice.legalMentions ?? ""} />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" defaultValue={invoice.notes ?? ""} />
                  </div>
                  <div className="flex justify-end"><Button type="submit">Enregistrer</Button></div>
                </form>
              </Modal>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Émission</span><span>{formatDate(invoice.issueDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Échéance</span><span>{formatDate(invoice.dueDate)}</span></div>
            </CardContent>
          </Card>

          {/* Paiements */}
          <Card>
            <CardHeader className="py-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Paiements</CardTitle>
              <Modal title="Enregistrer un paiement" trigger={<Button size="sm" variant="outline">+ Paiement</Button>}>
                <form action={addPayment.bind(null, invoice.id)} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="amount">Montant</Label>
                      <Input id="amount" name="amount" type="number" step="0.01" defaultValue={remaining > 0 ? remaining : ""} required />
                    </div>
                    <div>
                      <Label htmlFor="paidAt">Date</Label>
                      <Input id="paidAt" name="paidAt" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="method">Moyen</Label>
                    <Input id="method" name="method" placeholder="Virement, CB…" />
                  </div>
                  <div className="flex justify-end"><Button type="submit">Enregistrer</Button></div>
                </form>
              </Modal>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun paiement.</p>
              ) : (
                <div className="divide-y">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{formatDate(p.paidAt)}</span>
                      <span className="text-muted-foreground">{p.method}</span>
                      <span className="font-medium">{formatMoney(p.amount)}</span>
                      <ConfirmForm action={deletePayment.bind(null, p.id, invoice.id)}>
                        <button type="submit" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </ConfirmForm>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
