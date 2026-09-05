"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import {
  boolean,
  enumValue,
  integer,
  optionalString,
  requiredString,
} from "@/lib/form";

const SIDES = ["CPP", "CPW"] as const;
const INVITATIONS = ["FISIK", "DIGITAL"] as const;
const ATTENDANCE = ["BELUM_KONFIRMASI", "HADIR", "TIDAK_HADIR"] as const;

function refresh() {
  revalidatePath("/tamu");
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    name: requiredString(formData, "name", "Nama tamu"),
    origin: optionalString(formData, "origin"),
    side: enumValue(formData, "side", SIDES, "CPP"),
    invitationType: enumValue(formData, "invitationType", INVITATIONS, "FISIK"),
    attendance: enumValue(formData, "attendance", ATTENDANCE, "BELUM_KONFIRMASI"),
    invited: boolean(formData, "invited"),
    pax: Math.max(1, integer(formData, "pax", 1)),
    phone: optionalString(formData, "phone"),
    note: optionalString(formData, "note"),
  };
}

export async function createGuest(formData: FormData) {
  return runAction(async () => {
    await prisma.guest.create({ data: parse(formData) });
    refresh();
  });
}

export async function updateGuest(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.guest.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteGuest(id: string) {
  return runAction(async () => {
    await prisma.guest.delete({ where: { id } });
    refresh();
  });
}

export async function toggleGuestInvited(id: string, invited: boolean) {
  return runAction(async () => {
    await prisma.guest.update({ where: { id }, data: { invited } });
    refresh();
  });
}

export async function setGuestAttendance(
  id: string,
  attendance: (typeof ATTENDANCE)[number],
) {
  return runAction(async () => {
    await prisma.guest.update({ where: { id }, data: { attendance } });
    refresh();
  });
}
