"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { runPublicAction } from "@/lib/action-result";
import { endSession, isValidPin, PIN_LENGTH, verifyPin } from "@/lib/auth";

export async function unlockApp(pin: string) {
  return runPublicAction(async () => {
    if (!isValidPin(pin)) throw new Error(`PIN harus ${PIN_LENGTH} angka`);
    await verifyPin(pin);
  });
}

export async function lockApp() {
  await endSession();
  revalidatePath("/", "layout");
  redirect("/masuk");
}
