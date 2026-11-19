import { startOfDayWIB } from "@/lib/format";

/** Helpers to read values out of a FormData inside server actions. */

export function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requiredString(formData: FormData, key: string, label = key) {
  const value = optionalString(formData, key);
  if (!value) throw new Error(`${label} wajib diisi`);
  return value;
}

/** Accepts "12.500.000", "12500000", "Rp 12.500.000" and returns 12500000. */
export function money(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return 0;
  const digits = raw.replace(/[^\d-]/g, "");
  if (!digits) return 0;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function integer(formData: FormData, key: string, fallback = 0) {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.trim() === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function boolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function date(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = startOfDayWIB(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function enumValue<T extends string>(
  formData: FormData,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = formData.get(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}
