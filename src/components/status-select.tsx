"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";

export function StatusSelect({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: Record<string, string>;
  onChange: (status: string) => Promise<void> | void;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Select
      value={value}
      disabled={pending}
      className={className}
      onChange={(e) => {
        const v = e.target.value;
        startTransition(() => {
          void onChange(v);
        });
      }}
    >
      {Object.entries(options).map(([k, label]) => (
        <option key={k} value={k}>
          {label}
        </option>
      ))}
    </Select>
  );
}
