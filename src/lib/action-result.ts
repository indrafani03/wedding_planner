import { requireSession } from "@/lib/auth";

export type ActionResult = { ok: boolean; message?: string };

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await fn();
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan, coba lagi.";
    return { ok: false, message };
  }
}

/**
 * Wraps a mutation so validation/DB errors surface as a toast instead of a
 * crash, and so no write can happen without an unlocked session. Server
 * Actions are reachable by direct POST, so the proxy alone is not enough.
 */
export async function runAction(fn: () => Promise<void>): Promise<ActionResult> {
  return run(async () => {
    await requireSession();
    await fn();
  });
}

/** For the PIN screen itself, which by definition runs while locked. */
export async function runPublicAction(
  fn: () => Promise<void>,
): Promise<ActionResult> {
  return run(fn);
}
