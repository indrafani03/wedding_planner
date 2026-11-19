"use client";

import { useOptimistic, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useActionToast } from "@/components/form/use-action-toast";
import type { Attendance } from "@/generated/prisma/enums";
import { setGuestAttendance } from "./actions";

const choices: { value: Attendance; label: string; active: string }[] = [
  {
    value: "HADIR",
    label: "Hadir",
    active: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    value: "TIDAK_HADIR",
    label: "Tidak",
    active: "bg-rose-600 text-white border-rose-600",
  },
  {
    value: "BELUM_KONFIRMASI",
    label: "Belum",
    active: "bg-neutral-600 text-white border-neutral-600",
  },
];

export function AttendanceToggle({
  id,
  attendance,
}: {
  id: string;
  attendance: Attendance;
}) {
  const [optimistic, setOptimistic] = useOptimistic(attendance);
  const [, startTransition] = useTransition();
  const report = useActionToast();

  return (
    <div role="group" aria-label="Kehadiran" className="grid grid-cols-3 gap-1.5">
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          aria-pressed={optimistic === choice.value}
          onClick={() => {
            startTransition(async () => {
              setOptimistic(choice.value);
              report(await setGuestAttendance(id, choice.value), {
                failure: "Gagal memperbarui",
              });
            });
          }}
          className={cn(
            "h-11 rounded-lg border text-xs font-medium transition-colors",
            optimistic === choice.value
              ? choice.active
              : "text-muted-foreground bg-background",
          )}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
