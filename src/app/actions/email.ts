"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getInvoice } from "@/lib/data/invoices";
import { getSettings } from "@/lib/settings";
import { getUserId } from "@/lib/auth";
import { renderFinancePdf } from "@/lib/pdf/finance-pdf";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function sendInvoiceByEmail(invoiceId: string, formData: FormData) {
  const userId = await getUserId();
  const to = (formData.get("to") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  if (!to) return { ok: false, error: "Adresse e-mail manquante." };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Resend non configuré (RESEND_API_KEY)." };

  const data = await getInvoice(invoiceId);
  if (!data) return { ok: false, error: "Facture introuvable." };
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

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "PILOTE <onboarding@resend.dev>",
      to,
      subject: `Facture ${data.invoice.number}`,
      text:
        message ||
        `Bonjour,\n\nVeuillez trouver ci-joint la facture ${data.invoice.number}.\n\nCordialement,\n${issuer.name ?? ""}`,
      attachments: [
        { filename: `${data.invoice.number}.pdf`, content: buffer },
      ],
    });

    // Marque comme envoyée si encore en brouillon
    if (data.invoice.status === "brouillon") {
      await db.update(invoices).set({ status: "envoyee" }).where(eq(invoices.id, invoiceId));
    }

    revalidatePath(`/facturation/factures/${invoiceId}`);
    return { ok: true };
  } catch (e) {
    console.error("[resend] envoi échoué", e);
    return { ok: false, error: "Échec de l'envoi de l'e-mail." };
  }
}
