"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sideFilters = [
  { value: "", label: "Semua" },
  { value: "CPP", label: "CPP" },
  { value: "CPW", label: "CPW" },
];

const attendanceFilters = [
  { value: "", label: "Semua" },
  { value: "HADIR", label: "Hadir" },
  { value: "TIDAK_HADIR", label: "Tidak" },
  { value: "BELUM_KONFIRMASI", label: "Belum" },
];

export function GuestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const side = searchParams.get("side") ?? "";
  const attendance = searchParams.get("attendance") ?? "";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="pl-9"
          placeholder="Cari nama atau asal tamu..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(event) => setParam("q", event.target.value)}
        />
      </div>

      <FilterRow
        options={sideFilters}
        active={side}
        onSelect={(value) => setParam("side", value)}
      />
      <FilterRow
        options={attendanceFilters}
        active={attendance}
        onSelect={(value) => setParam("attendance", value)}
      />
    </div>
  );
}

function FilterRow({
  options,
  active,
  onSelect,
}: {
  options: { value: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="bg-muted flex gap-1 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            active === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
