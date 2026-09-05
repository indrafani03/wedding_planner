import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative" | "accent";
  className?: string;
}) {
  const toneClass = {
    default: "bg-card",
    positive: "bg-emerald-50 border-emerald-200",
    negative: "bg-rose-50 border-rose-200",
    accent: "bg-violet-50 border-violet-200",
  }[tone];

  return (
    <div className={cn("rounded-xl border p-3", toneClass, className)}>
      <p className="text-muted-foreground text-[11px] font-medium">{label}</p>
      <p className="mt-0.5 text-base leading-tight font-semibold tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="text-muted-foreground mt-0.5 text-[11px]">{hint}</p>
      ) : null}
    </div>
  );
}

export function ProgressCard({
  label,
  done,
  total,
  hint,
}: {
  label: string;
  done: number;
  total: number;
  hint?: string;
}) {
  const value = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="bg-card rounded-xl border p-3">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium">{label}</p>
        <p className="text-muted-foreground text-xs tabular-nums">
          {done}/{total} · {value}%
        </p>
      </div>
      <Progress value={value} className="mt-2 h-2" />
      {hint ? (
        <p className="text-muted-foreground mt-1.5 text-[11px]">{hint}</p>
      ) : null}
    </div>
  );
}

export function SectionTitle({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <h2 className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
        {children}
      </h2>
      {right}
    </div>
  );
}
