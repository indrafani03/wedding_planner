import { prisma } from "@/lib/prisma";

export const PROFILE_ID = "default";

/** The app is single-couple: one profile row, created on first read. */
export async function getProfile() {
  return prisma.weddingProfile.upsert({
    where: { id: PROFILE_ID },
    update: {},
    create: { id: PROFILE_ID },
  });
}
