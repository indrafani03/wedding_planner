"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Delete, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { unlockApp } from "./actions";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinPad({
  next,
  coupleLabel,
}: {
  next: string;
  coupleLabel: string;
}) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [pending, startTransition] = useTransition();

  /** Fires as soon as the last digit lands — no submit button needed. */
  const submit = (value: string) => {
    startTransition(async () => {
      const result = await unlockApp(value);
      if (result.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      toast.error(result.message ?? "PIN salah");
      setPin("");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    });
  };

  const press = (key: string) => {
    if (pending) return;
    if (key === "del") {
      setPin((value) => value.slice(0, -1));
      return;
    }
    if (!key || pin.length >= PIN_LENGTH) return;

    const nextPin = pin + key;
    setPin(nextPin);
    if (nextPin.length === PIN_LENGTH) submit(nextPin);
  };

  // Hardware keyboard, for when the app is opened on a laptop.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) press(event.key);
      else if (event.key === "Backspace") press("del");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-8 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/logo.png"
          alt="Logo Wedding PNC"
          width={112}
          height={112}
          priority
        />
        <div>
          <h1 className="text-xl font-bold">Masukkan PIN</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{coupleLabel}</p>
        </div>
      </div>

      <div
        className={cn("flex gap-4", shake && "animate-[shake_0.4s]")}
        role="status"
        aria-label={`${pin.length} dari ${PIN_LENGTH} angka terisi`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-4 rounded-full border-2 transition-colors",
              index < pin.length
                ? "bg-primary border-primary"
                : "border-muted-foreground/30",
            )}
          />
        ))}
      </div>

      <div className="grid w-full max-w-[280px] grid-cols-3 gap-3">
        {KEYS.map((key, index) =>
          key === "" ? (
            <span key={index} />
          ) : (
            <button
              key={index}
              type="button"
              disabled={pending}
              onClick={() => press(key)}
              aria-label={key === "del" ? "Hapus" : key}
              className={cn(
                "flex h-16 items-center justify-center rounded-2xl text-2xl font-medium transition-colors select-none",
                key === "del"
                  ? "text-muted-foreground active:bg-muted"
                  : "bg-card border active:bg-accent",
                pending && "opacity-50",
              )}
            >
              {key === "del" ? <Delete className="size-6" /> : key}
            </button>
          ),
        )}
      </div>

      <p className="text-muted-foreground flex h-5 items-center gap-2 text-xs">
        {pending ? (
          <>
            <LoaderCircle className="size-3.5 animate-spin" />
            Memeriksa...
          </>
        ) : (
          "Aplikasi terkunci"
        )}
      </p>
    </div>
  );
}
