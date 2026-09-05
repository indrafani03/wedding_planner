const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const rupiahCompact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 12.500.000 -> "Rp12.500.000" */
export function formatIDR(value: number | null | undefined) {
  return rupiah.format(value ?? 0);
}

/** 12.500.000 -> "12,5 jt" */
export function formatIDRCompact(value: number | null | undefined) {
  return `Rp${rupiahCompact.format(value ?? 0)}`;
}

export function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID").format(value ?? 0);
}

const dateLong = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateShort = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  return dateLong.format(new Date(value));
}

export function formatDateShort(value: Date | string | null | undefined) {
  if (!value) return "-";
  return dateShort.format(new Date(value));
}

/** Date -> "2027-08-14" for <input type="date"> */
export function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

/** Whole days from today until the given date (negative = already passed). */
export function daysUntil(value: Date | string | null | undefined) {
  if (!value) return null;
  const target = new Date(value);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function countdownLabel(value: Date | string | null | undefined) {
  const days = daysUntil(value);
  if (days === null) return "-";
  if (days === 0) return "Hari ini!";
  if (days > 0) return `${days} hari lagi`;
  return `Lewat ${Math.abs(days)} hari`;
}

export function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}
