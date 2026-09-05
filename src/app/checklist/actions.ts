"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import { boolean, date, optionalString, requiredString } from "@/lib/form";

function refresh() {
  revalidatePath("/checklist");
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    section: requiredString(formData, "section", "Bagian"),
    subSection: optionalString(formData, "subSection"),
    name: requiredString(formData, "name", "Kegiatan"),
    deadline: date(formData, "deadline"),
    done: boolean(formData, "done"),
    note: optionalString(formData, "note"),
  };
}

export async function createChecklistTask(formData: FormData) {
  return runAction(async () => {
    const last = await prisma.checklistTask.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await prisma.checklistTask.create({
      data: { ...parse(formData), sortOrder: (last?.sortOrder ?? 0) + 10 },
    });
    refresh();
  });
}

export async function updateChecklistTask(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.checklistTask.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteChecklistTask(id: string) {
  return runAction(async () => {
    await prisma.checklistTask.delete({ where: { id } });
    refresh();
  });
}

export async function toggleChecklistTask(id: string, done: boolean) {
  return runAction(async () => {
    await prisma.checklistTask.update({ where: { id }, data: { done } });
    refresh();
  });
}
