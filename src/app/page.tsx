import Link from "next/link";
import { CalendarHeart, ChevronRight, Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProgressCard, SectionTitle, StatCard, StatGrid } from "@/components/stat";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import {
  countdownLabel,
  daysUntil,
  formatDate,
  formatIDR,
  percent,
} from "@/lib/format";
import { modules } from "@/lib/nav";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    profile,
    cashflow,
    budgets,
    adminItems,
    seserahan,
    documents,
    guests,
    tasks,
  ] = await Promise.all([
    getProfile(),
    prisma.cashflowEntry.findMany({ select: { type: true, amount: true } }),
    prisma.budgetItem.findMany({
      select: { scope: true, totalCost: true, term1: true, term2: true, term3: true, term4: true },
    }),
    prisma.adminBudgetItem.findMany({
      select: { qty: true, estimationPrice: true, realPrice: true, status: true },
    }),
    prisma.seserahanItem.findMany({
      select: { qty: true, budget: true, actualPrice: true, checked: true },
    }),
    prisma.documentItem.findMany({ select: { progress: true } }),
    prisma.guest.findMany({ select: { attendance: true, pax: true } }),
    prisma.checklistTask.findMany({ select: { done: true, deadline: true } }),
  ]);

  const income = cashflow
    .filter((e) => e.type === "INCOME")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = cashflow
    .filter((e) => e.type === "EXPENSE")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expense;

  const engagementBudget = budgets
    .filter((b) => b.scope === "ENGAGEMENT")
    .reduce((sum, b) => sum + b.totalCost, 0);
  const weddingBudget = budgets
    .filter((b) => b.scope === "WEDDING")
    .reduce((sum, b) => sum + b.totalCost, 0);
  const afterMarriedBudget = budgets
    .filter((b) => b.scope === "AFTER_MARRIED")
    .reduce((sum, b) => sum + b.totalCost, 0);
  const adminBudget = adminItems.reduce(
    (sum, i) => sum + (i.realPrice || i.estimationPrice) * i.qty,
    0,
  );
  const seserahanBudget = seserahan.reduce(
    (sum, i) => sum + (i.actualPrice || i.budget) * i.qty,
    0,
  );

  const grandTotal =
    engagementBudget +
    weddingBudget +
    afterMarriedBudget +
    adminBudget +
    seserahanBudget;

  const paid = budgets.reduce(
    (sum, b) => sum + b.term1 + b.term2 + b.term3 + b.term4,
    0,
  );

  const documentsDone = documents.filter((d) => d.progress === "SUDAH").length;
  const tasksDone = tasks.filter((t) => t.done).length;
  const overdueTasks = tasks.filter(
    (t) => !t.done && t.deadline && (daysUntil(t.deadline) ?? 0) < 0,
  ).length;
  const guestsHadir = guests.filter((g) => g.attendance === "HADIR");
  const hadirPax = guestsHadir.reduce((sum, g) => sum + g.pax, 0);
  const seserahanDone = seserahan.filter((i) => i.checked).length;

  const targetProgress = percent(income, profile.savingTarget);

  return (
    <>
      <PageHeader
        title="Wedding Planner"
        subtitle={`${profile.groomName} & ${profile.brideName}`}
        showBack={false}
        action={
          <Link
            href="/pengaturan"
            aria-label="Pengaturan"
            className="hover:bg-accent flex size-8 items-center justify-center rounded-full"
          >
            <Settings className="size-4.5" />
          </Link>
        }
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="from-primary to-primary/80 text-primary-foreground rounded-2xl bg-gradient-to-br p-4">
          <p className="flex items-center gap-1.5 text-[11px] opacity-85">
            <CalendarHeart className="size-3.5" />
            Hari Pernikahan
          </p>
          <p className="mt-1 text-2xl font-bold">
            {profile.weddingDate ? countdownLabel(profile.weddingDate) : "Belum diatur"}
          </p>
          <p className="mt-0.5 text-xs opacity-90">
            {profile.weddingDate
              ? formatDate(profile.weddingDate)
              : "Atur tanggal di halaman Pengaturan"}
          </p>
          {profile.engagementDate ? (
            <p className="mt-2 border-t border-white/20 pt-2 text-[11px] opacity-85">
              Lamaran: {formatDate(profile.engagementDate)} ·{" "}
              {countdownLabel(profile.engagementDate)}
            </p>
          ) : null}
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-muted-foreground text-[11px] font-medium">
              Tabungan terkumpul
            </p>
            <p className="text-xs font-semibold tabular-nums">{targetProgress}%</p>
          </div>
          <p className="text-xl font-bold tabular-nums">{formatIDR(income)}</p>
          <Progress value={targetProgress} className="mt-2 h-2" />
          <p className="text-muted-foreground mt-1.5 text-[11px]">
            Target {formatIDR(profile.savingTarget)} · sisa{" "}
            {formatIDR(Math.max(0, profile.savingTarget - income))}
          </p>
        </div>

        <StatGrid>
          <StatCard
            label="Saldo Kas"
            value={formatIDR(balance)}
            hint={`Keluar ${formatIDR(expense)}`}
            tone={balance < 0 ? "negative" : "positive"}
          />
          <StatCard
            label="Total Rencana Biaya"
            value={formatIDR(grandTotal)}
            hint={`Terbayar ${formatIDR(paid)}`}
            tone="accent"
          />
          <StatCard
            label="Tamu Hadir"
            value={`${guestsHadir.length}`}
            hint={`± ${hadirPax} orang · ${guests.length} undangan`}
          />
          <StatCard
            label="Deadline Lewat"
            value={`${overdueTasks}`}
            hint={`${tasks.length - tasksDone} kegiatan tersisa`}
            tone={overdueTasks > 0 ? "negative" : "default"}
          />
        </StatGrid>

        <SectionTitle>Progress</SectionTitle>
        <div className="flex flex-col gap-2">
          <ProgressCard
            label="Vendor checklist"
            done={tasksDone}
            total={tasks.length}
          />
          <ProgressCard
            label="Administrasi & dokumen"
            done={documentsDone}
            total={documents.length}
          />
          <ProgressCard
            label="Seserahan dibeli"
            done={seserahanDone}
            total={seserahan.length}
          />
        </div>

        <SectionTitle>Rincian Budget</SectionTitle>
        <div className="bg-card divide-y rounded-xl border">
          {[
            { label: "Budget Lamaran", value: engagementBudget, href: "/budget/lamaran" },
            { label: "Wedding Budget", value: weddingBudget, href: "/budget/wedding" },
            { label: "Budget Administrasi", value: adminBudget, href: "/budget-administrasi" },
            { label: "List Seserahan", value: seserahanBudget, href: "/seserahan" },
            { label: "After Married", value: afterMarriedBudget, href: "/after-married" },
          ].map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="hover:bg-accent flex items-center justify-between gap-2 px-3 py-2.5 first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="text-sm">{row.label}</span>
              <span className="flex items-center gap-1 text-sm font-semibold tabular-nums">
                {formatIDR(row.value)}
                <ChevronRight className="text-muted-foreground size-4" />
              </span>
            </Link>
          ))}
        </div>

        <SectionTitle>Semua Modul</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-card hover:bg-accent flex flex-col gap-2 rounded-xl border p-3 transition-colors"
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    item.accent,
                  )}
                >
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm leading-tight font-semibold">
                  {item.label}
                </span>
                <span className="text-muted-foreground text-[11px] leading-tight">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
