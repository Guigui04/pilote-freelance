import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUS } from "@/lib/labels";

type Project = {
  name?: string | null;
  companyId?: string | null;
  description?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: string | null;
  hourlyRate?: string | null;
  color?: string | null;
};

export function ProjectFormFields({
  project,
  companies,
}: {
  project?: Project;
  companies: { id: string; name: string }[];
}) {
  return (
    <>
      <div>
        <Label htmlFor="name">Nom du projet *</Label>
        <Input id="name" name="name" defaultValue={project?.name ?? ""} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Début</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={project?.startDate ?? ""} />
        </div>
        <div>
          <Label htmlFor="endDate">Échéance</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={project?.endDate ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="budget">Budget (€)</Label>
          <Input id="budget" name="budget" type="number" step="0.01" defaultValue={project?.budget ?? ""} />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Taux horaire (€)</Label>
          <Input id="hourlyRate" name="hourlyRate" type="number" step="0.01" defaultValue={project?.hourlyRate ?? ""} />
        </div>
        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input id="color" name="color" type="color" defaultValue={project?.color ?? "#6366f1"} className="h-9 p-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={project?.description ?? ""} />
      </div>
    </>
  );
}
