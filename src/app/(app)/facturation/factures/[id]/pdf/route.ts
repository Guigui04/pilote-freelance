import { getInvoice } from "@/lib/data/invoices";
import { getSettings } from "@/lib/settings";
import { getUserId } from "@/lib/auth";
import { renderFinancePdf } from "@/lib/pdf/finance-pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  const data = await getInvoice(id);
  if (!data) return new Response("Introuvable", { status: 404 });
  const s = await getSettings(userId);
  const issuer = (s.companyInfo as Record<string, string>) ?? {};

  const buffer = await renderFinancePdf({
    kind: "facture",
    number: data.invoice.number,
    issueDate: data.invoice.issueDate,
    dueLabel: "Échéance",
    dueDate: data.invoice.dueDate,
    company: data.company
      ? { name: data.company.name, address: data.company.address, siret: data.company.siret }
      : null,
    items: data.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      vatRate: it.vatRate,
    })),
    subtotal: data.invoice.subtotal,
    vatAmount: data.invoice.vatAmount,
    total: data.invoice.total,
    legalMentions: data.invoice.legalMentions ?? s.legalMentions,
    notes: data.invoice.notes,
    issuer,
    currency: s.currency ?? "EUR",
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.invoice.number}.pdf"`,
    },
  });
}
