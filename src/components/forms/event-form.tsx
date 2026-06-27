import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EventData = {
  title?: string | null;
  description?: string | null;
  location?: string | null;
  startAt?: string;
  endAt?: string;
  projectId?: string | null;
};

export function EventFormFields({
  event,
  projects,
  defaultDate,
}: {
  event?: EventData;
  projects: { id: string; name: string }[];
  defaultDate?: string;
}) {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre *</Label>
        <Input id="title" name="title" defaultValue={event?.title ?? ""} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startAt">Début *</Label>
          <Input
            id="startAt"
            name="startAt"
            type="datetime-local"
            defaultValue={event?.startAt ?? defaultDate ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="endAt">Fin</Label>
          <Input id="endAt" name="endAt" type="datetime-local" defaultValue={event?.endAt ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="projectId">Projet</Label>
          <Select id="projectId" name="projectId" defaultValue={event?.projectId ?? ""}>
            <option value="">— Aucun —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Lieu</Label>
          <Input id="location" name="location" defaultValue={event?.location ?? ""} />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Notes</Label>
        <Textarea id="description" name="description" defaultValue={event?.description ?? ""} />
      </div>
    </>
  );
}
