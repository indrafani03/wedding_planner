/**
 * Returns `value` only when it is a same-origin path. Rejects absolute URLs,
 * protocol-relative `//host` and `/\host` (browsers treat `\` like `/`).
 */
export function safeNextPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
