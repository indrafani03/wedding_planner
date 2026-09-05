"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import {
  enumValue,
  integer,
  money,
  optionalString,
  requiredString,
} from "@/lib/form";

const STATUSES = ["NOT_YET", "ON_PROGRESS", "DONE"] as const;

function refresh() {
  revalidatePath("/budget-administrasi");
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    category: requiredString(formData, "category", "Kategori"),
    name: requiredString(formData, "name", "Nama"),
    handledBy: optionalString(formData, "handledBy"),
    qty: integer(formData, "qty", 1),
    estimationPrice: money(formData, "estimationPrice"),
    realPrice: money(formData, "realPrice"),
    status: enumValue(formData, "status", STATUSES, "NOT_YET"),
    note: optionalString(formData, "note"),
  };
}

export async function createAdminBudgetItem(formData: FormData) {
  return runAction(async () => {
    const last = await prisma.adminBudgetItem.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await prisma.adminBudgetItem.create({
      data: { ...parse(formData), sortOrder: (last?.sortOrder ?? 0) + 10 },
    });
    refresh();
  });
}

export async function updateAdminBudgetItem(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.adminBudgetItem.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteAdminBudgetItem(id: string) {
  return runAction(async () => {
    await prisma.adminBudgetItem.delete({ where: { id } });
    refresh();
  });
}

export async function cycleAdminBudgetStatus(id: string, next: boolean) {
  return runAction(async () => {
    await prisma.adminBudgetItem.update({
      where: { id },
      data: { status: next ? "DONE" : "NOT_YET" },
    });
    refresh();
  });
}
