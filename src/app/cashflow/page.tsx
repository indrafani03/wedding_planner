import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { StatCard, StatGrid, SectionTitle } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import {
  formatDateShort,
  formatIDR,
  percent,
  toDateInputValue,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { deleteCashflowEntry } from "./actions";
import { CashflowEntrySheet } from "./entry-sheet";

export const dynamic = "force-dynamic";

export default async function CashflowPage() {
  const [profile, entries] = await Promise.all([
    getProfile(),
    prisma.cashflowEntry.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
  ]);

  const sum = (type: "INCOME" | "EXPENSE", party?: "CPP" | "CPW") =>
    entries
      .filter((e) => e.type === type && (!party || e.party === party))
      .reduce((total, e) => total + e.amount, 0);

  const incomeCPP = sum("INCOME", "CPP");
  const incomeCPW = sum("INCOME", "CPW");
  const expenseCPP = sum("EXPENSE", "CPP");
  const expenseCPW = sum("EXPENSE", "CPW");
  const totalIncome = incomeCPP + incomeCPW;
  const totalExpense = expenseCPP + expenseCPW;
  const balance = totalIncome - totalExpense;
  const stillToSave = Math.max(0, profile.savingTarget - totalIncome);
  const targetProgress = percent(totalIncome, profile.savingTarget);

  return (
    <>
      <PageHeader
        title="Wedding Cash Flow"
        subtitle="Tabungan & pengeluaran persiapan"
        action={
          <CashflowEntrySheet
            groomName={profile.groomName}
            brideName={profile.brideName}
          />
        }
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-[11px] font-medium">
            Saldo Akhir
          </p>
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              balance < 0 ? "text-rose-600" : "text-emerald-600",
            )}
          >
            {formatIDR(balance)}
          </p>
          <div className="mt-3 flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">
              Target {formatIDR(profile.savingTarget)}
            </span>
            <span className="font-semibold tabular-nums">{targetProgress}%</span>
          </div>
          <Progress value={targetProgress} className="mt-1.5 h-2" />
          <p className="text-muted-foreground mt-2 text-[11px]">
            Masih harus ditabung {formatIDR(stillToSave)}
          </p>
        </div>

        <StatGrid>
          <StatCard
            label="Total Pemasukan"
            value={formatIDR(totalIncome)}
            hint={`CPP ${formatIDR(incomeCPP)} · CPW ${formatIDR(incomeCPW)}`}
            tone="positive"
          />
          <StatCard
            label="Total Pengeluaran"
            value={formatIDR(totalExpense)}
            hint={`CPP ${formatIDR(expenseCPP)} · CPW ${formatIDR(expenseCPW)}`}
            tone="negative"
          />
        </StatGrid>

        <SectionTitle>Riwayat ({entries.length})</SectionTitle>

        {entries.length === 0 ? (
          <EmptyState
            title="Belum ada catatan"
            description='Tekan "Tambah" di kanan atas untuk mencatat tabungan pertama.'
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => {
              const income = entry.type === "INCOME";
              return (
                <li key={entry.id} className="bg-card rounded-xl border p-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                        income
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700",
                      )}
                    >
                      {income ? (
                        <ArrowDownLeft className="size-4" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {entry.description}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateShort(entry.date)}
                        <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">
                          {entry.party}
                        </Badge>
                      </p>
                      {entry.note ? (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {entry.note}
                        </p>
                      ) : null}
                    </div>
                    <p
                      className={cn(
                        "shrink-0 text-sm font-semibold tabular-nums",
                        income ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {income ? "+" : "−"}
                      {formatIDR(entry.amount).replace("Rp", "")}
                    </p>
                  </div>
                  <div className="mt-1 flex justify-end gap-1">
                    <CashflowEntrySheet
                      groomName={profile.groomName}
                      brideName={profile.brideName}
                      entry={{
                        id: entry.id,
                        date: toDateInputValue(entry.date),
                        description: entry.description,
                        type: entry.type,
                        party: entry.party,
                        amount: entry.amount,
                        note: entry.note,
                      }}
                    />
                    <DeleteButton id={entry.id} action={deleteCashflowEntry} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
