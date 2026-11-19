"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runAction } from "@/lib/action-result";
import {
  date,
  enumValue,
  money,
  optionalString,
  requiredString,
} from "@/lib/form";

const TYPES = ["INCOME", "EXPENSE"] as const;
const PARTIES = ["CPP", "CPW"] as const;

function parse(formData: FormData) {
  const entryDate = date(formData, "date");
  if (!entryDate) throw new Error("Tanggal wajib diisi");

  const amount = money(formData, "amount");
  if (amount <= 0) throw new Error("Nominal wajib diisi dan lebih dari 0");

  return {
    date: entryDate,
    description: requiredString(formData, "description", "Keterangan"),
    type: enumValue(formData, "type", TYPES, "INCOME"),
    party: enumValue(formData, "party", PARTIES, "CPP"),
    amount,
    note: optionalString(formData, "note"),
  };
}

export async function createCashflowEntry(formData: FormData) {
  return runAction(async () => {
    await prisma.cashflowEntry.create({ data: parse(formData) });
    revalidatePath("/cashflow");
    revalidatePath("/");
  });
}

export async function updateCashflowEntry(formData: FormData) {
  return runAction(async () => {
    const id = requiredString(formData, "id");
    await prisma.cashflowEntry.update({ where: { id }, data: parse(formData) });
    revalidatePath("/cashflow");
    revalidatePath("/");
  });
}

export async function deleteCashflowEntry(id: string) {
  return runAction(async () => {
    await prisma.cashflowEntry.delete({ where: { id } });
    revalidatePath("/cashflow");
    revalidatePath("/");
  });
}
