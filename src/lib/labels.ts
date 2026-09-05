import type {
  Attendance,
  BudgetScope,
  CashflowType,
  InvitationType,
  Party,
  Progress,
  TodoStatus,
  VendorStatus,
} from "@/generated/prisma/enums";

type Option<T extends string> = { value: T; label: string };

export const partyOptions: Option<Party>[] = [
  { value: "CPP", label: "CPP (Pria)" },
  { value: "CPW", label: "CPW (Wanita)" },
];

export const partyLabel: Record<Party, string> = {
  CPP: "CPP",
  CPW: "CPW",
};

export const cashflowTypeOptions: Option<CashflowType>[] = [
  { value: "INCOME", label: "Pemasukan" },
  { value: "EXPENSE", label: "Pengeluaran" },
];

export const cashflowTypeLabel: Record<CashflowType, string> = {
  INCOME: "Pemasukan",
  EXPENSE: "Pengeluaran",
};

export const vendorStatusOptions: Option<VendorStatus>[] = [
  { value: "CHOOSE_VENDOR", label: "Choose Vendor" },
  { value: "DOWN_PAYMENT", label: "Down Payment" },
  { value: "FULL_PAYMENT", label: "Full Payment" },
  { value: "NOT_NEEDED", label: "Tidak Perlu" },
];

export const vendorStatusLabel: Record<VendorStatus, string> = {
  CHOOSE_VENDOR: "Choose Vendor",
  DOWN_PAYMENT: "Down Payment",
  FULL_PAYMENT: "Full Payment",
  NOT_NEEDED: "Tidak Perlu",
};

export const todoStatusOptions: Option<TodoStatus>[] = [
  { value: "NOT_YET", label: "Not Yet" },
  { value: "ON_PROGRESS", label: "On Progress" },
  { value: "DONE", label: "Done" },
];

export const todoStatusLabel: Record<TodoStatus, string> = {
  NOT_YET: "Not Yet",
  ON_PROGRESS: "On Progress",
  DONE: "Done",
};

export const progressOptions: Option<Progress>[] = [
  { value: "BELUM", label: "Belum" },
  { value: "SUDAH", label: "Sudah" },
];

export const invitationTypeOptions: Option<InvitationType>[] = [
  { value: "FISIK", label: "Fisik" },
  { value: "DIGITAL", label: "Digital" },
];

export const invitationTypeLabel: Record<InvitationType, string> = {
  FISIK: "Fisik",
  DIGITAL: "Digital",
};

export const attendanceOptions: Option<Attendance>[] = [
  { value: "BELUM_KONFIRMASI", label: "Belum Konfirmasi" },
  { value: "HADIR", label: "Hadir" },
  { value: "TIDAK_HADIR", label: "Tidak Hadir" },
];

export const attendanceLabel: Record<Attendance, string> = {
  BELUM_KONFIRMASI: "Belum Konfirmasi",
  HADIR: "Hadir",
  TIDAK_HADIR: "Tidak Hadir",
};

export const budgetScopeLabel: Record<BudgetScope, string> = {
  ENGAGEMENT: "Budget Lamaran",
  WEDDING: "Wedding Budget",
  AFTER_MARRIED: "After Married",
};
