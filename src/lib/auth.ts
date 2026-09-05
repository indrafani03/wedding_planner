import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_EXPIRED } from "@/lib/messages";

export const ATTEMPT_ID = "default";
export const SESSION_COOKIE = "wp_session";
export const PIN_LENGTH = 4;

/** How long an unlocked session stays valid. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Brute-force guard. A 4-digit PIN is only 10.000 combinations, so the
 * lockout is what actually keeps it useful.
 */
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 5;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error(
      "AUTH_SECRET belum diisi. Lihat .env.example untuk cara membuatnya.",
    );
  }
  return value;
}

/** The PIN itself, taken straight from the environment. */
function appPin() {
  const value = process.env.APP_PIN;
  if (!value) {
    throw new Error("APP_PIN belum diisi di .env");
  }
  if (!isValidPin(value)) {
    throw new Error(`APP_PIN harus tepat ${PIN_LENGTH} angka`);
  }
  return value;
}

/** Constant-time compare that tolerates different lengths. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isValidPin(pin: string) {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

/* ---------------- session cookie ---------------- */

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken() {
  const payload = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string | undefined) {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!safeEqual(signature, sign(payload))) return null;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  return { expiresAt };
}

/** Verifies the session cookie of the current request. Used by pages/actions. */
export async function getSession() {
  const store = await cookies();
  return readToken(store.get(SESSION_COOKIE)?.value);
}

/** Same check, but for the proxy where the cookie comes off the request. */
export function verifySessionToken(token: string | undefined) {
  return readToken(token) !== null;
}

async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Throws unless the caller holds a valid session. Guards every mutation. */
export async function requireSession() {
  if (!(await getSession())) throw new Error(SESSION_EXPIRED);
}

/* ---------------- PIN ---------------- */

async function getAttempts() {
  return prisma.pinAttempt.upsert({
    where: { id: ATTEMPT_ID },
    update: {},
    create: { id: ATTEMPT_ID },
  });
}

/** Remaining lock time in seconds, or 0 when unlocked. */
function lockRemaining(lockedUntil: Date | null) {
  if (!lockedUntil) return 0;
  return Math.max(0, Math.ceil((lockedUntil.getTime() - Date.now()) / 1000));
}

export async function verifyPin(pin: string) {
  const expected = appPin();
  const attempts = await getAttempts();

  const locked = lockRemaining(attempts.lockedUntil);
  if (locked > 0) {
    throw new Error(
      `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(locked / 60)} menit.`,
    );
  }

  if (!safeEqual(pin, expected)) {
    const failedAttempts = attempts.failedAttempts + 1;
    const shouldLock = failedAttempts >= MAX_ATTEMPTS;
    await prisma.pinAttempt.update({
      where: { id: ATTEMPT_ID },
      data: {
        failedAttempts: shouldLock ? 0 : failedAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCK_MINUTES * 60_000)
          : null,
      },
    });
    throw new Error(
      shouldLock
        ? `PIN salah. Terkunci ${LOCK_MINUTES} menit.`
        : `PIN salah. Sisa ${MAX_ATTEMPTS - failedAttempts} percobaan.`,
    );
  }

  await prisma.pinAttempt.update({
    where: { id: ATTEMPT_ID },
    data: { failedAttempts: 0, lockedUntil: null },
  });
  await startSession();
}
