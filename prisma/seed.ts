/**
 * Seeds the database with the contents of "docs/wedding cashflow.xlsx".
 * Safe to re-run: each table is only filled when it is still empty.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import seedData from "./seed-data.json" with { type: "json" };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const toDate = (value: string | null) => (value ? new Date(`${value}T00:00:00+07:00`) : null);

async function main() {
  // Fill the profile from the workbook, but never overwrite values the couple already set.
  const existing = await prisma.weddingProfile.findUnique({ where: { id: "default" } });
  await prisma.weddingProfile.upsert({
    where: { id: "default" },
    update: {
      weddingDate: existing?.weddingDate ?? toDate(seedData.weddingDate),
      savingTarget: existing?.savingTarget || seedData.savingTarget,
    },
    create: {
      id: "default",
      groomName: "CPP",
      brideName: "CPW",
      weddingDate: toDate(seedData.weddingDate),
      savingTarget: seedData.savingTarget,
    },
  });

  if ((await prisma.cashflowEntry.count()) === 0) {
    await prisma.cashflowEntry.createMany({
      data: seedData.cashflow.map((entry) => ({
        date: new Date(`${entry.date}T00:00:00+07:00`),
        description: entry.description,
        type: entry.type as "INCOME" | "EXPENSE",
        party: entry.party as "CPP" | "CPW",
        amount: entry.amount,
      })),
    });
  }

  if ((await prisma.budgetItem.count()) === 0) {
    await prisma.budgetItem.createMany({
      data: seedData.budgetItems.map((item) => ({
        scope: item.scope as "ENGAGEMENT" | "WEDDING" | "AFTER_MARRIED",
        category: item.category,
        detail: item.detail,
        status: item.status as
          | "NOT_NEEDED"
          | "CHOOSE_VENDOR"
          | "DOWN_PAYMENT"
          | "FULL_PAYMENT",
        vendor: item.vendor,
        totalCost: item.totalCost,
        note: item.note,
        term1: "term1" in item ? (item.term1 as number) : 0,
        term2: "term2" in item ? (item.term2 as number) : 0,
        term3: "term3" in item ? (item.term3 as number) : 0,
        term4: "term4" in item ? (item.term4 as number) : 0,
        sortOrder: item.sortOrder,
      })),
    });
  }

  if ((await prisma.adminBudgetItem.count()) === 0) {
    await prisma.adminBudgetItem.createMany({
      data: seedData.adminBudget.map((item) => ({
        category: item.category,
        name: item.name,
        handledBy: item.handledBy,
        qty: item.qty,
        estimationPrice: item.estimationPrice,
        realPrice: item.realPrice,
        status: item.status as "NOT_YET" | "ON_PROGRESS" | "DONE",
        note: item.note,
        sortOrder: item.sortOrder,
      })),
    });
  }

  if ((await prisma.seserahanItem.count()) === 0) {
    await prisma.seserahanItem.createMany({
      data: seedData.seserahan.map((item) => ({
        category: item.category,
        detail: item.detail,
        brand: item.brand,
        qty: item.qty,
        link: item.link,
        budget: item.budget,
        actualPrice: item.actualPrice,
        checked: item.checked,
        sortOrder: item.sortOrder,
      })),
    });
  }

  if ((await prisma.documentItem.count()) === 0) {
    await prisma.documentItem.createMany({
      data: seedData.documents.map((item) => ({
        groupCode: item.groupCode,
        groupName: item.groupName,
        name: item.name,
        progress: item.progress as "BELUM" | "SUDAH",
        details: item.details,
        sortOrder: item.sortOrder,
      })),
    });
  }

  if ((await prisma.checklistTask.count()) === 0) {
    await prisma.checklistTask.createMany({
      data: seedData.checklist.map((task) => ({
        section: task.section,
        subSection: task.subSection,
        name: task.name,
        deadline: toDate(task.deadline),
        done: task.done,
        note: task.note,
        sortOrder: task.sortOrder,
      })),
    });
  }

  const counts = {
    cashflow: await prisma.cashflowEntry.count(),
    budget: await prisma.budgetItem.count(),
    administrasi: await prisma.adminBudgetItem.count(),
    seserahan: await prisma.seserahanItem.count(),
    dokumen: await prisma.documentItem.count(),
    checklist: await prisma.checklistTask.count(),
    tamu: await prisma.guest.count(),
  };
  console.log("Seed selesai:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
