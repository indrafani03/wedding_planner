import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MobileShell } from "@/components/mobile-shell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding Planner",
  description:
    "Aplikasi perencanaan pernikahan: cash flow, budget, seserahan, dokumen, tamu, dan checklist vendor.",
  appleWebApp: {
    capable: true,
    title: "Wedding Planner",
    statusBarStyle: "default",
  },
};

/** Locks the layout to a phone viewport and blocks pinch-zoom reflow. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        <MobileShell>{children}</MobileShell>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
