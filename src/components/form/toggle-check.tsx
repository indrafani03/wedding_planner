"use client";

import { useOptimistic, useTransition } from "react";
import type { ActionResult } from "@/lib/action-result";
import { useActionToast } from "@/components/form/use-action-toast";
import { Checkbox } from "@/components/ui/checkbox";

/** Checkbox that flips instantly and syncs through a server action. */
export function ToggleCheck({
  id,
  checked,
  action,
  ariaLabel,
}: {
  id: string;
  checked: boolean;
  action: (id: string, next: boolean) => Promise<ActionResult>;
  ariaLabel: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const [, startTransition] = useTransition();
  const report = useActionToast();

  return (
    <Checkbox
      checked={optimistic}
      aria-label={ariaLabel}
      className="size-5"
      onCheckedChange={(value) => {
        const next = value === true;
        startTransition(async () => {
          setOptimistic(next);
          report(await action(id, next), { failure: "Gagal memperbarui" });
        });
      }}
    />
  );
}
