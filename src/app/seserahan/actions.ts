"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import {
  boolean,
  integer,
  money,
  optionalString,
  requiredString,
} from "@/lib/form";

function refresh() {
  revalidatePath("/seserahan");
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    category: requiredString(formData, "category", "Kategori").toUpperCase(),
    detail: requiredString(formData, "detail", "Detail"),
    brand: optionalString(formData, "brand"),
    qty: integer(formData, "qty", 1),
    link: optionalString(formData, "link"),
    budget: money(formData, "budget"),
    actualPrice: money(formData, "actualPrice"),
    checked: boolean(formData, "checked"),
  };
}

export async function createSeserahanItem(formData: FormData) {
  return runAction(async () => {
    const last = await prisma.seserahanItem.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await prisma.seserahanItem.create({
      data: { ...parse(formData), sortOrder: (last?.sortOrder ?? 0) + 10 },
    });
    refresh();
  });
}

export async function updateSeserahanItem(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.seserahanItem.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteSeserahanItem(id: string) {
  return runAction(async () => {
    await prisma.seserahanItem.delete({ where: { id } });
    refresh();
  });
}

export async function toggleSeserahanItem(id: string, checked: boolean) {
  return runAction(async () => {
    await prisma.seserahanItem.update({ where: { id }, data: { checked } });
    refresh();
  });
}
