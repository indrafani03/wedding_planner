"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export { planVsActual } from "@/lib/plan-vs-actual";

/** "12.500.000" -> 12500000, same rule the server actions use. */
function toNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

/**
 * Tracks the numeric inputs named in `initial` while the user types, without
 * turning them into controlled inputs. Put `onInput` on a wrapper element.
 */
export function useLiveNumbers<K extends string>(initial: Record<K, number>) {
  const [values, setValues] = useState(initial);

  const onInput = (event: FormEvent<HTMLElement>) => {
    const input = event.target as HTMLInputElement;
    if (!(input.name in initial)) return;
    setValues((prev) => ({ ...prev, [input.name]: toNumber(input.value) }));
  };

  return [values, onInput] as const;
}

export type SummaryTone = "neutral" | "good" | "bad";

/** Two-column result box shown under money fields (paid vs remaining, etc). */
export function SummaryBox({
  tone = "neutral",
  left,
  right,
  note,
}: {
  tone?: SummaryTone;
  left: { label: string; value: ReactNode };
  right: { label: string; value: ReactNode };
  note?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs",
        tone === "bad" && "border-rose-200 bg-rose-50",
        tone === "good" && "border-emerald-200 bg-emerald-50",
        tone === "neutral" && "bg-muted/50",
      )}
    >
      <div>
        <p className="text-muted-foreground">{left.label}</p>
        <p className="text-sm font-semibold tabular-nums">{left.value}</p>
      </div>
      <div className="text-right">
        <p className="text-muted-foreground">{right.label}</p>
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            tone === "bad" && "text-rose-700",
            tone === "good" && "text-emerald-700",
          )}
        >
          {right.value}
        </p>
      </div>
      {note ? (
        <p className={cn("col-span-2", tone === "bad" ? "text-rose-700" : "text-muted-foreground")}>
          {note}
        </p>
      ) : null}
    </div>
  );
}
