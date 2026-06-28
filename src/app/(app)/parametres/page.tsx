import { CheckCircle2, XCircle, Download } from "lucide-react";
import { getUserId } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getIntegration } from "@/lib/integrations";
import { isAiConfigured } from "@/lib/ai";
import { updateSettings, saveNotionToken } from "@/app/actions/settings";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function IntegrationRow({ name, connected, hint }: { name: string; connected: boolean; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium">{name}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {connected ? (
        <span className="inline-flex items-center gap-1 text-sm text-green-600"><CheckCircle2 className="h-4 w-4" /> Connecté</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><XCircle className="h-4 w-4" /> Non connecté</span>
      )}
    </div>
  );
}

export default async function ParametresPage() {
  const userId = await getUserId();
  const s = await getSettings(userId);
  const issuer = (s.companyInfo as Record<string, string>) ?? {};
  const [google, notion] = await Promise.all([
    getIntegration(userId, "google"),
    getIntegration(userId, "notion"),
  ]);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Paramètres" description="Profil, facturation et intégrations." />

      {/* Profil émetteur */}
      <form action={updateSettings} className="space-y-4">
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Identité (émetteur des factures)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nom / Raison sociale</Label><Input name="issuerName" defaultValue={issuer.name ?? ""} /></div>
              <div><Label>SIRET</Label><Input name="issuerSiret" defaultValue={issuer.siret ?? ""} /></div>
            </div>
            <div><Label>Adresse</Label><Input name="issuerAddress" defaultValue={issuer.address ?? ""} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>E-mail</Label><Input name="issuerEmail" type="email" defaultValue={issuer.email ?? ""} /></div>
              <div><Label>Téléphone</Label><Input name="issuerPhone" defaultValue={issuer.phone ?? ""} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Facturation & fiscalité</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Régime fiscal</Label>
                <Select name="fiscalRegime" defaultValue={s.fiscalRegime ?? "auto_entrepreneur"}>
                  <option value="auto_entrepreneur">Auto-entrepreneur</option>
                  <option value="ei">Entreprise individuelle</option>
                  <option value="eurl">EURL</option>
                  <option value="sasu">SASU</option>
                </Select>
              </div>
              <div>
                <Label>Devise</Label>
                <Select name="currency" defaultValue={s.currency ?? "EUR"}>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="CHF">CHF</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>TVA applicable</Label>
                <Select name="vatApplicable" defaultValue={s.vatApplicable ? "true" : "false"}>
                  <option value="false">Non</option>
                  <option value="true">Oui</option>
                </Select>
              </div>
              <div><Label>Taux TVA (%)</Label><Input name="vatRate" type="number" step="0.1" defaultValue={s.vatRate ?? "0"} /></div>
              <div><Label>Taux URSSAF (%)</Label><Input name="urssafRate" type="number" step="0.1" defaultValue={s.urssafRate ?? "22"} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div><Label>TJM par défaut (€)</Label><Input name="defaultDailyRate" type="number" step="0.01" defaultValue={s.defaultDailyRate ?? ""} /></div>
              <div><Label>Base heures / jour</Label><Input name="hoursPerDay" type="number" step="0.5" defaultValue={s.hoursPerDay ?? "7"} /></div>
              <div><Label>Préfixe factures</Label><Input name="invoicePrefix" defaultValue={s.invoicePrefix ?? "F"} /></div>
              <div><Label>Préfixe devis</Label><Input name="quotePrefix" defaultValue={s.quotePrefix ?? "D"} /></div>
            </div>
            <div><Label>Mentions légales</Label><Textarea name="legalMentions" defaultValue={s.legalMentions ?? ""} /></div>
            <input type="hidden" name="timezone" value={s.timezone ?? "Europe/Paris"} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Enregistrer les paramètres</Button>
        </div>
      </form>

      {/* Intégrations */}
      <Card className="mt-4">
        <CardHeader className="py-3"><CardTitle className="text-base">Intégrations</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y">
            <IntegrationRow name="Google (Calendar, Drive, Sheets)" connected={!!google} hint="Connecté via la connexion Google." />
            <IntegrationRow name="Google Gemini (IA)" connected={isAiConfigured()} hint="Variable GEMINI_API_KEY." />
            <IntegrationRow name="Resend (e-mails)" connected={!!process.env.RESEND_API_KEY} hint="Variable RESEND_API_KEY." />
            <IntegrationRow name="Notion" connected={!!notion} hint="Jeton d'intégration interne Notion." />
          </div>
          <form action={saveNotionToken} className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="notionToken">Jeton Notion</Label>
              <Input id="notionToken" name="notionToken" placeholder="secret_…" />
            </div>
            <Button type="submit" variant="outline">Connecter Notion</Button>
          </form>
        </CardContent>
      </Card>

      {/* Données */}
      <Card className="mt-4">
        <CardHeader className="py-3"><CardTitle className="text-base">Données</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Exporte toutes tes données au format JSON.</p>
          <a href="/api/export" className={buttonVariants({ variant: "outline" })}>
            <Download /> Exporter
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
