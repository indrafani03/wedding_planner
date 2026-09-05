"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import { enumValue, optionalString, requiredString } from "@/lib/form";

const PROGRESS = ["BELUM", "SUDAH"] as const;

function refresh() {
  revalidatePath("/dokumen");
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    groupCode: requiredString(formData, "groupCode", "Kode grup").toUpperCase(),
    groupName: requiredString(formData, "groupName", "Nama grup"),
    name: requiredString(formData, "name", "Nama dokumen"),
    progress: enumValue(formData, "progress", PROGRESS, "BELUM"),
    details: optionalString(formData, "details"),
  };
}

export async function createDocumentItem(formData: FormData) {
  return runAction(async () => {
    const last = await prisma.documentItem.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await prisma.documentItem.create({
      data: { ...parse(formData), sortOrder: (last?.sortOrder ?? 0) + 10 },
    });
    refresh();
  });
}

export async function updateDocumentItem(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.documentItem.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteDocumentItem(id: string) {
  return runAction(async () => {
    await prisma.documentItem.delete({ where: { id } });
    refresh();
  });
}

export async function toggleDocumentItem(id: string, done: boolean) {
  return runAction(async () => {
    await prisma.documentItem.update({
      where: { id },
      data: { progress: done ? "SUDAH" : "BELUM" },
    });
    refresh();
  });
}
