"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { ActionResult } from "@/lib/action-result";
import { useActionToast } from "@/components/form/use-action-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Bottom sheet holding a form that posts to a server action.
 * Closes itself and toasts on success; keeps the sheet open on failure.
 */
export function FormSheet({
  trigger,
  title,
  description,
  action,
  children,
  submitLabel = "Simpan",
  successMessage = "Tersimpan",
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  action: (formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  submitLabel?: string;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const report = useActionToast();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await action(formData);
              if (report(result, { success: successMessage })) setOpen(false);
            });
          }}
          className="flex flex-col gap-4 px-4"
        >
          {children}
          <SheetFooter className="px-0">
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Menyimpan..." : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
