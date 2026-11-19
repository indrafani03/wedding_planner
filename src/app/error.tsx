"use client";

import { useTransition } from "react";
import Link from "next/link";
import { CloudOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Catches failed page renders (usually the database not answering). */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-8 text-center">
      <CloudOff className="text-muted-foreground size-10" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">Data gagal dimuat</h1>
        <p className="text-muted-foreground text-sm">
          Koneksi ke database terputus atau sedang lambat. Data kamu aman, coba muat
          ulang sebentar lagi.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground mt-1 text-xs">Kode: {error.digest}</p>
        ) : null}
      </div>
      <div className="flex w-full max-w-[260px] flex-col gap-2">
        <Button
          className="h-11 w-full gap-2"
          disabled={pending}
          onClick={() => startTransition(() => retry())}
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {pending ? "Memuat ulang..." : "Coba lagi"}
        </Button>
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
