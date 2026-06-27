"use client";

import { useTransition } from "react";
import { Trash2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TASK_PRIORITY, PRIORITY_VARIANT, TASK_TYPE } from "@/lib/labels";
import { cn, formatDateTime } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  type: string;
  dueDate: Date | string | null;
  projectName?: string | null;
  companyName?: string | null;
};

export function TaskItem({
  task,
  toggle,
  remove,
  showContext,
}: {
  task: Task;
  toggle: () => Promise<void> | void;
  remove: () => Promise<void> | void;
  showContext?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const done = task.status === "termine";
  const overdue =
    !done && task.dueDate && new Date(task.dueDate).getTime() < Date.now();

  return (
    <div className={cn("flex items-center gap-3 py-2", pending && "opacity-50")}>
      <button
        onClick={() => startTransition(() => void toggle())}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
          done ? "bg-primary border-primary text-primary-foreground" : "border-input"
        )}
        aria-label="Terminer"
      >
        {done && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", done && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        {showContext && (task.projectName || task.companyName) && (
          <p className="text-xs text-muted-foreground">
            {[task.companyName, task.projectName].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {task.type !== "tache" && (
        <Badge variant="outline">{TASK_TYPE[task.type]}</Badge>
      )}
      {task.dueDate && (
        <span className={cn("text-xs", overdue ? "text-destructive" : "text-muted-foreground")}>
          {formatDateTime(task.dueDate)}
        </span>
      )}
      <Badge variant={PRIORITY_VARIANT[task.priority]}>{TASK_PRIORITY[task.priority]}</Badge>

      <button
        onClick={() => {
          if (confirm("Supprimer cette tâche ?")) startTransition(() => void remove());
        }}
        className="text-muted-foreground hover:text-destructive"
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
