import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
      <Inbox className="text-muted-foreground size-8" strokeWidth={1.5} />
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground text-xs">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
