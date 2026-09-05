import { BudgetScreen } from "@/features/budget/budget-screen";
import { budgetConfigs } from "@/features/budget/config";

export const dynamic = "force-dynamic";

export default function EngagementBudgetPage() {
  return <BudgetScreen config={budgetConfigs.ENGAGEMENT} />;
}
