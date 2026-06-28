import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Req, Hint, SectionLabel, ColorField } from "@/components/forms/form-kit";
import { PROJECT_STATUS } from "@/lib/labels";

type Project = {
  name?: string | null;
  companyId?: string | null;
  description?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: string | null;
  dailyRate?: string | null;
  color?: string | null;
};

export function ProjectFormFields({
  project,
  companies,
  defaultDailyRate,
}: {
  project?: Project;
  companies: { id: string; name: string }[];
  /** TJM pré-rempli sur un nouveau projet (issu des paramètres). */
  defaultDailyRate?: string | null;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="name">
          Nom du projet <Req />
        </Label>
        <Input id="name" name="name" defaultValue={project?.name ?? ""} placeholder="Ex. Refonte site vitrine" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyId">Client</Label>
          <Select id="companyId" name="companyId" defaultValue={project?.companyId ?? ""}>
            <option value="">— Aucun —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select id="status" name="status" defaultValue={project?.status ?? "a_faire"}>
            {Object.entries(PROJECT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="border-t border-border/60 pt-4">
        <SectionLabel>Planning</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Début</Label>
            <Input id="startDate" name="startDate" type="date" defaultValue={project?.startDate ?? ""} />
          </div>
          <div>
            <Label htmlFor="endDate">Échéance</Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={project?.endDate ?? ""} />
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 pt-4">
        <SectionLabel>Tarification</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dailyRate">Taux journalier / TJM (€)</Label>
            <Input
              id="dailyRate"
              name="dailyRate"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex. 390"
              defaultValue={project?.dailyRate ?? defaultDailyRate ?? ""}
            />
            <Hint>Sert à valoriser le temps suivi et les factures.</Hint>
          </div>
          <div>
            <Label htmlFor="budget">Budget (€)</Label>
            <Input id="budget" name="budget" type="number" step="0.01" inputMode="decimal" placeholder="Optionnel" defaultValue={project?.budget ?? ""} />
            <Hint>Enveloppe totale indicative.</Hint>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorField name="color" defaultValue={project?.color} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={project?.description ?? ""} placeholder="Objectifs, périmètre, livrables…" />
      </div>
    </div>
  );
}
