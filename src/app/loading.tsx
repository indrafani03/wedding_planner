import { Skeleton } from "@/components/ui/skeleton";

/** Shown while a page's data loads, shaped like the usual header + cards. */
export default function Loading() {
  return (
    <div role="status" aria-label="Memuat halaman">
      <div className="flex min-h-14 items-center gap-3 border-b px-4 py-1.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </div>
  );
}
