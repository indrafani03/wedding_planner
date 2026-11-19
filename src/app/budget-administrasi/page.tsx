import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProgressCard, SectionTitle, StatCard, StatGrid } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/format";
import { todoStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { TodoStatus } from "@/generated/prisma/enums";
import { deleteAdminBudgetItem } from "./actions";
import { AdminBudgetItemSheet } from "./item-sheet";

export const dynamic = "force-dynamic";

const statusTone: Record<TodoStatus, string> = {
  NOT_YET: "bg-neutral-100 text-neutral-600",
  ON_PROGRESS: "bg-amber-100 text-amber-800",
  DONE: "bg-emerald-100 text-emerald-800",
};

export default async function AdminBudgetPage() {
  const items = await prisma.adminBudgetItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const estimation = items.reduce((sum, i) => sum + i.estimationPrice * i.qty, 0);
  const real = items.reduce((sum, i) => sum + i.realPrice * i.qty, 0);
  // Only items that already have a real price can be compared; the rest
  // would otherwise count their whole estimate as "savings".
  const priced = items.filter((i) => i.realPrice > 0);
  const offBudget = priced.reduce(
    (sum, i) => sum + (i.estimationPrice - i.realPrice) * i.qty,
    0,
  );
  const offBudgetHint =
    priced.length === 0
      ? "Belum ada harga real"
      : `${offBudget >= 0 ? "Hemat" : "Over"} ${formatIDR(Math.abs(offBudget))} dari ${priced.length} item`;
  const done = items.filter((i) => i.status === "DONE").length;

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const bucket = groups.get(item.category);
    if (bucket) bucket.push(item);
    else groups.set(item.category, [item]);
  }

  return (
    <>
      <PageHeader
        title="Budget Administrasi"
        subtitle="Estimasi vs harga real"
        action={<AdminBudgetItemSheet />}
      />

      <div className="flex flex-col gap-4 p-4">
        <StatGrid>
          <StatCard
            label="Total Estimasi"
            value={formatIDR(estimation)}
            hint={`${items.length} item`}
            tone="accent"
          />
          <StatCard
            label="Total Real"
            value={formatIDR(real)}
            hint={offBudgetHint}
            tone={
              priced.length === 0 ? "default" : offBudget >= 0 ? "positive" : "negative"
            }
          />
        </StatGrid>

        <ProgressCard label="Progress" done={done} total={items.length} />

        {items.length === 0 ? (
          <EmptyState
            title="Belum ada item administrasi"
            description='Tekan "Tambah" untuk mencatat kebutuhan administrasi.'
          />
        ) : (
          [...groups.entries()].map(([category, categoryItems]) => (
            <section key={category} className="flex flex-col gap-2">
              <SectionTitle
                right={
                  <span className="text-xs font-semibold tabular-nums">
                    {formatIDR(
                      categoryItems.reduce(
                        (sum, i) => sum + (i.realPrice || i.estimationPrice) * i.qty,
                        0,
                      ),
                    )}
                  </span>
                }
              >
                {category}
              </SectionTitle>

              {categoryItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-tight font-semibold">
                        {item.name}
                        {item.qty > 1 ? (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            ×{item.qty}
                          </span>
                        ) : null}
                      </p>
                      {item.handledBy ? (
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          by {item.handledBy}
                        </p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatIDR(item.realPrice || item.estimationPrice)}
                      </p>
                      {item.realPrice > 0 && item.estimationPrice > 0 ? (
                        <p className="text-muted-foreground text-[11px] line-through tabular-nums">
                          {formatIDR(item.estimationPrice)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge
                      className={cn(
                        "h-5 border-0 px-2 text-[10px]",
                        statusTone[item.status],
                      )}
                    >
                      {todoStatusLabel[item.status]}
                    </Badge>
                    {item.note ? (
                      <span className="text-muted-foreground text-[11px]">
                        {item.note}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 flex justify-end gap-1">
                    <AdminBudgetItemSheet
                      item={{
                        id: item.id,
                        category: item.category,
                        name: item.name,
                        handledBy: item.handledBy,
                        qty: item.qty,
                        estimationPrice: item.estimationPrice,
                        realPrice: item.realPrice,
                        status: item.status,
                        note: item.note,
                      }}
                    />
                    <DeleteButton id={item.id} action={deleteAdminBudgetItem} />
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </>
  );
}
