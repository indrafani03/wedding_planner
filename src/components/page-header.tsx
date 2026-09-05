import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  backHref = "/",
  showBack = true,
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  showBack?: boolean;
  action?: ReactNode;
}) {
  return (
    <header className="bg-background/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-3">
        {showBack ? (
          <Link
            href={backHref}
            aria-label="Kembali"
            className="hover:bg-accent -ml-1 flex size-8 shrink-0 items-center justify-center rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold">{title}</h1>
          {subtitle ? (
            <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}
