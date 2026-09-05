"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import {
  enumValue,
  money,
  optionalString,
  requiredString,
} from "@/lib/form";
import { budgetPaths } from "./config";

const SCOPES = ["ENGAGEMENT", "WEDDING", "AFTER_MARRIED"] as const;
const STATUSES = [
  "NOT_NEEDED",
  "CHOOSE_VENDOR",
  "DOWN_PAYMENT",
  "FULL_PAYMENT",
] as const;

function refresh() {
  for (const path of budgetPaths) revalidatePath(path);
  revalidatePath("/");
}

function parse(formData: FormData) {
  return {
    scope: enumValue(formData, "scope", SCOPES, "WEDDING"),
    category: requiredString(formData, "category", "Kategori").toUpperCase(),
    detail: requiredString(formData, "detail", "Detail"),
    status: enumValue(formData, "status", STATUSES, "CHOOSE_VENDOR"),
    vendor: optionalString(formData, "vendor"),
    totalCost: money(formData, "totalCost"),
    note: optionalString(formData, "note"),
    term1: money(formData, "term1"),
    term2: money(formData, "term2"),
    term3: money(formData, "term3"),
    term4: money(formData, "term4"),
  };
}

export async function createBudgetItem(formData: FormData) {
  return runAction(async () => {
    const data = parse(formData);
    const last = await prisma.budgetItem.findFirst({
      where: { scope: data.scope },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await prisma.budgetItem.create({
      data: { ...data, sortOrder: (last?.sortOrder ?? 0) + 10 },
    });
    refresh();
  });
}

export async function updateBudgetItem(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.budgetItem.update({ where: { id }, data: parse(formData) });
    refresh();
  });
}

export async function deleteBudgetItem(id: string) {
  return runAction(async () => {
    await prisma.budgetItem.delete({ where: { id } });
    refresh();
  });
}
