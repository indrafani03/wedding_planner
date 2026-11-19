import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PlanDiff } from "@/components/plan-diff";
import { EmptyState } from "@/components/empty-state";
import { ProgressCard, SectionTitle, StatCard, StatGrid } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { ToggleCheck } from "@/components/form/toggle-check";
import { prisma } from "@/lib/prisma";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { deleteSeserahanItem, toggleSeserahanItem } from "./actions";
import { SeserahanItemSheet } from "./item-sheet";

export const dynamic = "force-dynamic";

export default async function SeserahanPage() {
  const items = await prisma.seserahanItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const budget = items.reduce((sum, i) => sum + i.budget * i.qty, 0);
  const actual = items.reduce((sum, i) => sum + i.actualPrice * i.qty, 0);
  const bought = items.filter((i) => i.checked).length;

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const bucket = groups.get(item.category);
    if (bucket) bucket.push(item);
    else groups.set(item.category, [item]);
  }

  return (
    <>
      <PageHeader
        title="List Seserahan"
        subtitle="Checklist hantaran & brand"
        action={<SeserahanItemSheet />}
      />

      <div className="flex flex-col gap-4 p-4">
        <StatGrid>
          <StatCard
            label="Total Budget"
            value={formatIDR(budget)}
            hint={`${items.length} item`}
            tone="accent"
          />
          <StatCard
            label="Total Aktual"
            value={formatIDR(actual)}
            hint={`${bought} sudah dibeli`}
            tone="positive"
          />
        </StatGrid>

        <ProgressCard
          label="Progress belanja"
          done={bought}
          total={items.length}
        />

        {items.length === 0 ? (
          <EmptyState
            title="Belum ada seserahan"
            description='Tekan "Tambah" untuk menyusun list hantaran.'
          />
        ) : (
          [...groups.entries()].map(([category, categoryItems]) => (
            <section key={category} className="flex flex-col gap-2">
              <SectionTitle
                right={
                  <span className="text-xs font-semibold tabular-nums">
                    {formatIDR(
                      categoryItems.reduce(
                        (sum, i) => sum + (i.actualPrice || i.budget) * i.qty,
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
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <ToggleCheck
                        id={item.id}
                        checked={item.checked}
                        action={toggleSeserahanItem}
                        ariaLabel={`Tandai ${item.detail} sudah dibeli`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm leading-tight font-semibold",
                          item.checked && "text-muted-foreground line-through",
                        )}
                      >
                        {item.detail}
                        {item.qty > 1 ? (
                          <span className="font-normal"> ×{item.qty}</span>
                        ) : null}
                      </p>
                      {item.brand ? (
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {item.brand}
                        </p>
                      ) : null}
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary mt-1 inline-flex items-center gap-1 text-xs underline"
                        >
                          Lihat produk
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatIDR(item.actualPrice || item.budget)}
                      </p>
                      {item.actualPrice > 0 && item.budget > 0 ? (
                        <p className="text-muted-foreground text-[11px] line-through tabular-nums">
                          {formatIDR(item.budget)}
                        </p>
                      ) : null}
                      <PlanDiff plan={item.budget} actual={item.actualPrice} qty={item.qty} />
                    </div>
                  </div>

                  <div className="mt-1 flex justify-end gap-1">
                    <SeserahanItemSheet
                      item={{
                        id: item.id,
                        category: item.category,
                        detail: item.detail,
                        brand: item.brand,
                        qty: item.qty,
                        link: item.link,
                        budget: item.budget,
                        actualPrice: item.actualPrice,
                        checked: item.checked,
                      }}
                    />
                    <DeleteButton id={item.id} action={deleteSeserahanItem} />
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
