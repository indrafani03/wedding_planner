"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Wait this long after the last keystroke before asking the server. */
const SEARCH_DELAY_MS = 300;

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
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  const side = searchParams.get("side") ?? "";
  const attendance = searchParams.get("attendance") ?? "";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          aria-label="Cari tamu"
          className="pl-9"
          placeholder="Cari nama atau asal tamu..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(
              () => setParam("q", value.trim()),
              SEARCH_DELAY_MS,
            );
          }}
        />
      </div>

      <FilterRow
        label="Filter pihak"
        options={sideFilters}
        active={side}
        onSelect={(value) => setParam("side", value)}
      />
      <FilterRow
        label="Filter kehadiran"
        options={attendanceFilters}
        active={attendance}
        onSelect={(value) => setParam("attendance", value)}
      />
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="bg-muted flex gap-1 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={active === option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            "h-11 flex-1 rounded-md px-2 text-xs font-medium transition-colors",
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
