"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/action-result";
import { useActionToast } from "@/components/form/use-action-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteButton({
  id,
  action,
  label = "Hapus item ini?",
  description = "Data yang dihapus tidak bisa dikembalikan.",
}: {
  id: string;
  action: (id: string) => Promise<ActionResult>;
  label?: string;
  description?: string;
}) {
  const [pending, startTransition] = useTransition();
  const report = useActionToast();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:text-destructive h-11 gap-1.5 px-3"
        >
          <Trash2 className="size-3.5" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[340px] rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{label}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end gap-2">
          <AlertDialogCancel className="mt-0 h-11 px-4">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="h-11 px-4"
            disabled={pending}
            onClick={(event) => {
              event.preventDefault();
              startTransition(async () => {
                report(await action(id), {
                  success: "Item dihapus",
                  failure: "Gagal menghapus",
                });
              });
            }}
          >
            {pending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
