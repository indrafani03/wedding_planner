/**
 * Clears the PIN lockout after too many wrong attempts.
 * The PIN itself is not stored here — it lives in APP_PIN in .env.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
await prisma.pinAttempt.updateMany({
  data: { failedAttempts: 0, lockedUntil: null },
});
console.log("Kunci percobaan PIN dibuka. PIN diatur lewat APP_PIN di .env.");
await prisma.$disconnect();
