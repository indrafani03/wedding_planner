"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/bottom-nav";

/**
 * Forces the whole app into a phone-sized viewport.
 * On a phone it fills the screen; on a desktop it renders a centered
 * 430px "device" so the layout never stretches into a desktop UI.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  // The PIN screen is shown while locked, so it gets no navigation.
  const locked = usePathname() === "/masuk";

  return (
    <div className="bg-app-backdrop flex min-h-dvh justify-center">
      <div className="bg-background relative flex min-h-dvh w-full max-w-[430px] flex-col shadow-[0_0_60px_-15px_rgba(0,0,0,0.25)]">
        <main className={cn("flex-1", !locked && "pb-24")}>{children}</main>
        {locked ? null : <BottomNav />}
      </div>
    </div>
  );
}
