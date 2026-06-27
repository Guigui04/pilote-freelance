import { db } from "@/lib/db";
import { invoices, tasks } from "@/lib/db/schema";
import { and, eq, inArray, isNotNull, lt } from "drizzle-orm";

/** Passe les factures échues non payées en "en_retard". */
export async function markOverdueInvoices(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const candidates = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(
      and(
        isNotNull(invoices.dueDate),
        lt(invoices.dueDate, today),
        inArray(invoices.status, ["envoyee", "partiel"])
      )
    );
  if (candidates.length === 0) return 0;
  await db
    .update(invoices)
    .set({ status: "en_retard" })
    .where(inArray(invoices.id, candidates.map((c) => c.id)));
  return candidates.length;
}

function computeNextDue(base: Date, rule: string | null): Date {
  const d = new Date(base);
  switch ((rule ?? "weekly").toLowerCase()) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "weekly":
    default:
      d.setDate(d.getDate() + 7);
      break;
  }
  return d;
}

/**
 * Régénère les tâches récurrentes terminées : crée la prochaine occurrence et
 * retire le marqueur récurrent de la tâche terminée.
 */
export async function regenerateRecurringTasks(): Promise<number> {
  const done = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.isRecurring, true), eq(tasks.status, "termine")));

  let created = 0;
  for (const t of done) {
    const base = t.dueDate ? new Date(t.dueDate) : new Date();
    const nextDue = computeNextDue(base, t.recurrenceRule);
    await db.insert(tasks).values({
      userId: t.userId,
      projectId: t.projectId,
      companyId: t.companyId,
      title: t.title,
      description: t.description,
      type: t.type,
      priority: t.priority,
      status: "a_faire",
      dueDate: nextDue,
      estimatedMinutes: t.estimatedMinutes,
      isRecurring: true,
      recurrenceRule: t.recurrenceRule,
      tags: t.tags,
    });
    await db.update(tasks).set({ isRecurring: false }).where(eq(tasks.id, t.id));
    created++;
  }
  return created;
}

export async function runAllCronJobs() {
  const overdue = await markOverdueInvoices();
  const recurring = await regenerateRecurringTasks();
  return { overdue, recurring };
}
