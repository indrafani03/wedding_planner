"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/action-result";
import { SESSION_EXPIRED } from "@/lib/messages";

/**
 * Reports a server action's outcome. When the session expired mid-use, it
 * also refreshes so the proxy sends the user back to the PIN screen.
 */
export function useActionToast() {
  const router = useRouter();

  return useCallback(
    (
      result: ActionResult,
      { success, failure = "Gagal menyimpan" }: { success?: string; failure?: string } = {},
    ) => {
      if (result.ok) {
        if (success) toast.success(success);
        return true;
      }
      toast.error(result.message ?? failure);
      if (result.message === SESSION_EXPIRED) router.refresh();
      return false;
    },
    [router],
  );
}
