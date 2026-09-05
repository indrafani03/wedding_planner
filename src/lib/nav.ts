import {
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Gift,
  Home,
  ListChecks,
  Settings,
  Sofa,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

/** Every sheet of "wedding cashflow.xlsx" mapped to a screen. */
export const modules: NavItem[] = [
  {
    href: "/cashflow",
    label: "Wedding Cash Flow",
    short: "Cash Flow",
    description: "Tabungan & pengeluaran CPP/CPW",
    icon: Wallet,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/budget/lamaran",
    label: "Budget Lamaran",
    short: "Lamaran",
    description: "Rincian biaya acara lamaran",
    icon: Gift,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    href: "/budget/wedding",
    label: "Wedding Budget",
    short: "Wedding",
    description: "Rincian biaya + termin bayar",
    icon: ClipboardList,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    href: "/budget-administrasi",
    label: "Budget Administrasi",
    short: "Adm. Budget",
    description: "Estimasi vs harga real",
    icon: BadgeCheck,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    href: "/seserahan",
    label: "List Seserahan",
    short: "Seserahan",
    description: "Checklist hantaran & brand",
    icon: Gift,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    href: "/dokumen",
    label: "Administrasi & Dokumen",
    short: "Dokumen",
    description: "Berkas N1-N4, KUA, dll",
    icon: ListChecks,
    accent: "bg-teal-100 text-teal-700",
  },
  {
    href: "/tamu",
    label: "Daftar Tamu",
    short: "Tamu",
    description: "Undangan & konfirmasi hadir",
    icon: Users,
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    href: "/checklist",
    label: "Vendor Checklist",
    short: "Checklist",
    description: "To-do dengan countdown",
    icon: CalendarClock,
    accent: "bg-orange-100 text-orange-700",
  },
  {
    href: "/after-married",
    label: "After Married",
    short: "After",
    description: "Perabotan rumah tangga",
    icon: Sofa,
    accent: "bg-lime-100 text-lime-700",
  },
];

/** Bottom tab bar — 5 slots, the last one opens the full module drawer. */
export const primaryTabs: NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    short: "Beranda",
    description: "Ringkasan persiapan",
    icon: Home,
    accent: "bg-neutral-100 text-neutral-700",
  },
  modules[0],
  modules[2],
  modules[6],
];

export const settingsItem: NavItem = {
  href: "/pengaturan",
  label: "Pengaturan",
  short: "Setelan",
  description: "Nama pasangan, tanggal, target",
  icon: Settings,
  accent: "bg-neutral-100 text-neutral-700",
};
