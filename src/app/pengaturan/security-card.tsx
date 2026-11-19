"use client";

import { useTransition } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { lockApp } from "@/app/masuk/actions";

export function SecurityCard() {
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">Keamanan</p>
          <p className="text-muted-foreground text-xs">
            Aplikasi dikunci dengan PIN 4 angka. Untuk mengganti PIN, ubah{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-[11px]">APP_PIN</code>{" "}
            di file <code className="bg-muted rounded px-1 py-0.5 text-[11px]">.env</code>{" "}
            lalu jalankan ulang aplikasi.
          </p>
        </div>

        <Button
          variant="outline"
          className="h-11 w-full justify-start gap-2"
          disabled={pending}
          onClick={() => startTransition(() => lockApp())}
        >
          <Lock className="size-4" />
          {pending ? "Mengunci..." : "Kunci aplikasi"}
        </Button>
      </CardContent>
    </Card>
  );
}
