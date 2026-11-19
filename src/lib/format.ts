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

/**
 * Every calendar date is read in WIB, whatever timezone the server runs in,
 * so "today" and countdowns flip at midnight Jakarta time.
 */
export const APP_TIME_ZONE = "Asia/Jakarta";

const dateLong = new Intl.DateTimeFormat("id-ID", {
  timeZone: APP_TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateShort = new Intl.DateTimeFormat("id-ID", {
  timeZone: APP_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** en-CA formats as YYYY-MM-DD, the shape <input type="date"> wants. */
const isoDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
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
  return isoDay.format(new Date(value));
}

/** Today's date in WIB as "2027-08-14". */
export function todayInputValue() {
  return isoDay.format(new Date());
}

/** "2027-08-14" (a WIB calendar day) -> the instant it starts. */
export function startOfDayWIB(day: string) {
  return new Date(`${day}T00:00:00+07:00`);
}

/** Whole days from today until the given date (negative = already passed). */
export function daysUntil(value: Date | string | null | undefined) {
  if (!value) return null;
  const target = Date.parse(toDateInputValue(value));
  const today = Date.parse(todayInputValue());
  return Math.round((target - today) / 86_400_000);
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
