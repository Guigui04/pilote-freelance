import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmForm } from "@/components/confirm-form";
import { formatMoney } from "@/lib/utils";

type Item = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  vatRate: string;
};

export function LineItems({
  items,
  addAction,
  deleteActionFor,
  currency = "EUR",
}: {
  items: Item[];
  addAction: (formData: FormData) => Promise<void>;
  deleteActionFor: (itemId: string) => (formData: FormData) => Promise<void>;
  currency?: string;
}) {
  return (
    <div>
      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Désignation</th>
                <th className="py-2 font-medium text-right w-16">Qté</th>
                <th className="py-2 font-medium text-right w-24">PU HT</th>
                <th className="py-2 font-medium text-right w-16">TVA</th>
                <th className="py-2 font-medium text-right w-28">Total HT</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b">
                  <td className="py-2">{it.description}</td>
                  <td className="py-2 text-right">{Number(it.quantity)}</td>
                  <td className="py-2 text-right">{formatMoney(it.unitPrice, currency)}</td>
                  <td className="py-2 text-right">{Number(it.vatRate)}%</td>
                  <td className="py-2 text-right">
                    {formatMoney(Number(it.quantity) * Number(it.unitPrice), currency)}
                  </td>
                  <td className="py-2 text-right">
                    <ConfirmForm action={deleteActionFor(it.id)}>
                      <button type="submit" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </ConfirmForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form action={addAction} className="mt-3 flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[160px]">
          <Input name="description" placeholder="Désignation" required />
        </div>
        <Input name="quantity" type="number" step="0.01" defaultValue="1" className="w-20" placeholder="Qté" />
        <Input name="unitPrice" type="number" step="0.01" defaultValue="0" className="w-28" placeholder="PU HT" />
        <Input name="vatRate" type="number" step="0.01" defaultValue="0" className="w-20" placeholder="TVA %" />
        <Button type="submit" size="icon"><Plus /></Button>
      </form>
    </div>
  );
}
