import { BudgetScreen } from "@/features/budget/budget-screen";
import { budgetConfigs } from "@/features/budget/config";

export const dynamic = "force-dynamic";

export default function AfterMarriedPage() {
  return <BudgetScreen config={budgetConfigs.AFTER_MARRIED} />;
}
