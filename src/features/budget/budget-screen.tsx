import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { SectionTitle, StatCard, StatGrid } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/format";
import { vendorStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { VendorStatus } from "@/generated/prisma/enums";
import { deleteBudgetItem } from "./actions";
import { BudgetItemSheet } from "./budget-item-sheet";
import type { BudgetScreenConfig } from "./config";

const statusTone: Record<VendorStatus, string> = {
  NOT_NEEDED: "bg-neutral-100 text-neutral-600",
  CHOOSE_VENDOR: "bg-amber-100 text-amber-800",
  DOWN_PAYMENT: "bg-sky-100 text-sky-800",
  FULL_PAYMENT: "bg-emerald-100 text-emerald-800",
};

export async function BudgetScreen({ config }: { config: BudgetScreenConfig }) {
  const items = await prisma.budgetItem.findMany({
    where: { scope: config.scope },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const total = items.reduce((sum, item) => sum + item.totalCost, 0);
  const paid = items.reduce(
    (sum, item) => sum + item.term1 + item.term2 + item.term3 + item.term4,
    0,
  );
  const settled = items.filter((i) => i.status === "FULL_PAYMENT").length;
  const pending = items.filter((i) => i.status === "CHOOSE_VENDOR").length;

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const bucket = groups.get(item.category);
    if (bucket) bucket.push(item);
    else groups.set(item.category, [item]);
  }

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        action={
          <BudgetItemSheet
            scope={config.scope}
            categories={config.categories}
            showTerms={config.showTerms}
          />
        }
      />

      <div className="flex flex-col gap-4 p-4">
        <StatGrid>
          <StatCard
            label="Total Biaya"
            value={formatIDR(total)}
            hint={`${items.length} item`}
            tone="accent"
          />
          <StatCard
            label={config.showTerms ? "Sudah Dibayar" : "Item Lunas"}
            value={config.showTerms ? formatIDR(paid) : `${settled} item`}
            hint={
              config.showTerms
                ? `Sisa ${formatIDR(Math.max(0, total - paid))}`
                : `${pending} belum pilih vendor`
            }
            tone="positive"
          />
        </StatGrid>

        {items.length === 0 ? (
          <EmptyState
            title="Belum ada item budget"
            description='Tekan "Tambah" untuk mulai merinci biaya.'
          />
        ) : (
          [...groups.entries()].map(([category, categoryItems]) => {
            const categoryTotal = categoryItems.reduce(
              (sum, item) => sum + item.totalCost,
              0,
            );
            return (
              <section key={category} className="flex flex-col gap-2">
                <SectionTitle
                  right={
                    <span className="text-xs font-semibold tabular-nums">
                      {formatIDR(categoryTotal)}
                    </span>
                  }
                >
                  {category}
                </SectionTitle>

                {categoryItems.map((item) => {
                  const itemPaid =
                    item.term1 + item.term2 + item.term3 + item.term4;
                  return (
                    <div key={item.id} className="bg-card rounded-xl border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-tight font-semibold">
                            {item.detail}
                          </p>
                          {item.vendor ? (
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {item.vendor}
                            </p>
                          ) : null}
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatIDR(item.totalCost)}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge
                          className={cn(
                            "h-5 border-0 px-2 text-[10px]",
                            statusTone[item.status],
                          )}
                        >
                          {vendorStatusLabel[item.status]}
                        </Badge>
                        {config.showTerms && itemPaid > 0 ? (
                          <Badge
                            variant="outline"
                            className="h-5 px-2 text-[10px] tabular-nums"
                          >
                            Dibayar {formatIDR(itemPaid)}
                          </Badge>
                        ) : null}
                        {config.showTerms && itemPaid > 0 && item.totalCost > 0 ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-5 px-2 text-[10px] tabular-nums",
                              itemPaid > item.totalCost
                                ? "border-rose-200 text-rose-700"
                                : itemPaid === item.totalCost
                                  ? "border-emerald-200 text-emerald-700"
                                  : "",
                            )}
                          >
                            {itemPaid > item.totalCost
                              ? `Lebih bayar ${formatIDR(itemPaid - item.totalCost)}`
                              : itemPaid === item.totalCost
                                ? "Lunas"
                                : `Sisa ${formatIDR(item.totalCost - itemPaid)}`}
                          </Badge>
                        ) : null}
                        {item.note ? (
                          <span className="text-muted-foreground text-[11px]">
                            {item.note}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 flex justify-end gap-1">
                        <BudgetItemSheet
                          scope={config.scope}
                          categories={config.categories}
                          showTerms={config.showTerms}
                          item={{
                            id: item.id,
                            category: item.category,
                            detail: item.detail,
                            status: item.status,
                            vendor: item.vendor,
                            totalCost: item.totalCost,
                            note: item.note,
                            term1: item.term1,
                            term2: item.term2,
                            term3: item.term3,
                            term4: item.term4,
                          }}
                        />
                        <DeleteButton id={item.id} action={deleteBudgetItem} />
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
