"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PROFILE_ID } from "@/lib/profile";
import { runAction } from "@/lib/action-result";
import { date, money, optionalString, requiredString } from "@/lib/form";

export async function saveProfile(formData: FormData) {
  return runAction(async () => {
    const data = {
      groomName: requiredString(formData, "groomName", "Nama CPP"),
      brideName: requiredString(formData, "brideName", "Nama CPW"),
      weddingDate: date(formData, "weddingDate"),
      engagementDate: date(formData, "engagementDate"),
      savingTarget: money(formData, "savingTarget"),
      venue: optionalString(formData, "venue"),
    };

    await prisma.weddingProfile.upsert({
      where: { id: PROFILE_ID },
      update: data,
      create: { id: PROFILE_ID, ...data },
    });

    revalidatePath("/", "layout");
  });
}
