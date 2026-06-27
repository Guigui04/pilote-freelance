"use client";

import * as React from "react";

export function ConfirmForm({
  action,
  message = "Confirmer la suppression ?",
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
