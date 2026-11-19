import { formatIDR } from "@/lib/format";
import { planVsActual } from "@/lib/plan-vs-actual";
import { cn } from "@/lib/utils";

/** "Hemat Rp X" / "Over budget Rp X" under a list item's price (qty included). */
export function PlanDiff({
  plan,
  actual,
  qty,
}: {
  plan: number;
  actual: number;
  qty: number;
}) {
  if (plan <= 0 || actual <= 0) return null;
  const result = planVsActual(plan, actual, qty);
  const diff = result.planTotal - result.actualTotal;
  if (diff === 0) {
    return <p className="text-muted-foreground text-[11px]">Sesuai budget</p>;
  }
  return (
    <p
      className={cn(
        "text-[11px] font-medium tabular-nums",
        diff > 0 ? "text-emerald-700" : "text-rose-700",
      )}
    >
      {result.label} {formatIDR(Math.abs(diff))}
    </p>
  );
}
