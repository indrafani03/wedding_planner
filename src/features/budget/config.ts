import type { BudgetScope } from "@/generated/prisma/enums";

export type BudgetScreenConfig = {
  scope: BudgetScope;
  path: string;
  title: string;
  subtitle: string;
  /** Category suggestions, taken from the original spreadsheet. */
  categories: string[];
  /** Wedding budget tracks payments in 4 terms; the others do not. */
  showTerms: boolean;
};

export const budgetConfigs: Record<BudgetScope, BudgetScreenConfig> = {
  ENGAGEMENT: {
    scope: "ENGAGEMENT",
    path: "/budget/lamaran",
    title: "Budget Lamaran",
    subtitle: "Rincian biaya acara lamaran",
    categories: [
      "VENUE",
      "PRINTILAN ENGAGEMENT",
      "OUTFIT CPP",
      "OUTFIT CPW",
      "AKOMODASI",
    ],
    showTerms: false,
  },
  WEDDING: {
    scope: "WEDDING",
    path: "/budget/wedding",
    title: "Wedding Budget",
    subtitle: "Rincian biaya + termin pembayaran",
    categories: [
      "VENUE",
      "PRINTILAN WEDDING",
      "PREWEDDING",
      "BRIDESMAID THINGS",
      "OUTFIT CPP",
      "OUTFIT CPW",
      "AKOMODASI",
      "KEPERLUAN KELUARGA",
    ],
    showTerms: true,
  },
  AFTER_MARRIED: {
    scope: "AFTER_MARRIED",
    path: "/after-married",
    title: "After Married",
    subtitle: "Perabotan & keperluan rumah tangga",
    categories: [
      "PERABOTAN RUMAH TANGGA",
      "ELEKTRONIK",
      "DAPUR",
      "KAMAR",
      "LAIN-LAIN",
    ],
    showTerms: true,
  },
};

export const budgetPaths = Object.values(budgetConfigs).map((c) => c.path);
