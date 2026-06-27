import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY_STATUS } from "@/lib/labels";

type Company = {
  name?: string | null;
  sector?: string | null;
  siret?: string | null;
  address?: string | null;
  status?: string | null;
  color?: string | null;
  notes?: string | null;
};

export function CompanyFormFields({ company }: { company?: Company }) {
  return (
    <>
      <div>
        <Label htmlFor="name">Nom de la société *</Label>
        <Input id="name" name="name" defaultValue={company?.name ?? ""} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sector">Secteur</Label>
          <Input id="sector" name="sector" defaultValue={company?.sector ?? ""} />
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select id="status" name="status" defaultValue={company?.status ?? "prospect"}>
            {Object.entries(COMPANY_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="siret">SIRET</Label>
          <Input id="siret" name="siret" defaultValue={company?.siret ?? ""} />
        </div>
        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            name="color"
            type="color"
            defaultValue={company?.color ?? "#6366f1"}
            className="h-9 p-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={company?.address ?? ""} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={company?.notes ?? ""} />
      </div>
    </>
  );
}
