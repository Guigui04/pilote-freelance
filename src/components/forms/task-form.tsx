import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from "@/lib/labels";

export function TaskFormFields({
  projects,
  companies,
  fixedProjectId,
}: {
  projects?: { id: string; name: string }[];
  companies?: { id: string; name: string }[];
  fixedProjectId?: string;
}) {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre *</Label>
        <Input id="title" name="title" required />
      </div>

      {fixedProjectId ? (
        <input type="hidden" name="projectId" value={fixedProjectId} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {projects && (
            <div>
              <Label htmlFor="projectId">Projet</Label>
              <Select id="projectId" name="projectId" defaultValue="">
                <option value="">— Aucun —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {companies && (
            <div>
              <Label htmlFor="companyId">Client</Label>
              <Select id="companyId" name="companyId" defaultValue="">
                <option value="">— Aucun —</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" defaultValue="tache">
            {Object.entries(TASK_TYPE).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priorité</Label>
          <Select id="priority" name="priority" defaultValue="moyenne">
            {Object.entries(TASK_PRIORITY).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select id="status" name="status" defaultValue="a_faire">
            {Object.entries(TASK_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="dueDate">Échéance</Label>
          <Input id="dueDate" name="dueDate" type="datetime-local" />
        </div>
        <div>
          <Label htmlFor="estimatedHours">Estimation (h)</Label>
          <Input id="estimatedHours" name="estimatedHours" type="number" step="0.25" min="0" placeholder="ex. 1,5" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>
    </>
  );
}
