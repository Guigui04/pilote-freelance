import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Req, Hint, ColorField } from "@/components/forms/form-kit";
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
    <div className="space-y-5">
      <div>
        <Label htmlFor="name">
          Nom de la société <Req />
        </Label>
        <Input id="name" name="name" defaultValue={company?.name ?? ""} placeholder="Ex. Studio Lumen" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sector">Secteur</Label>
          <Input id="sector" name="sector" defaultValue={company?.sector ?? ""} placeholder="Ex. E-commerce" />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="siret">SIRET</Label>
          <Input id="siret" name="siret" inputMode="numeric" defaultValue={company?.siret ?? ""} placeholder="14 chiffres" />
        </div>
        <ColorField name="color" defaultValue={company?.color} />
      </div>

      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={company?.address ?? ""} placeholder="Rue, code postal, ville" />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={company?.notes ?? ""} placeholder="Contexte, contacts, préférences…" />
        <Hint>Visibles uniquement par toi.</Hint>
      </div>
    </div>
  );
}
