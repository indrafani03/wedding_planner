"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { modules, primaryTabs, settingsItem } from "@/lib/nav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-background/95 fixed bottom-0 z-40 w-full max-w-[430px] border-t backdrop-blur">
      <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                isActive(tab.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={isActive(tab.href) ? 2.4 : 1.8} />
              {tab.short}
            </Link>
          );
        })}

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium"
            aria-label="Semua menu"
          >
            <LayoutGrid className="size-5" strokeWidth={1.8} />
            Menu
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Semua Menu</SheetTitle>
              <SheetDescription>
                Sembilan modul persiapan pernikahan kamu.
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 px-4 pb-8">
              {[...modules, settingsItem].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="hover:bg-accent flex flex-col gap-2 rounded-xl border p-3 transition-colors"
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        item.accent,
                      )}
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <span className="text-sm leading-tight font-semibold">
                      {item.label}
                    </span>
                    <span className="text-muted-foreground text-xs leading-tight">
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
