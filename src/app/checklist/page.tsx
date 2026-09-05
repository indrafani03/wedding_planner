import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ProgressCard, SectionTitle, StatCard, StatGrid } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { ToggleCheck } from "@/components/form/toggle-check";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/profile";
import {
  countdownLabel,
  daysUntil,
  formatDateShort,
  toDateInputValue,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { deleteChecklistTask, toggleChecklistTask } from "./actions";
import { ChecklistTaskSheet } from "./task-sheet";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const [profile, tasks] = await Promise.all([
    getProfile(),
    prisma.checklistTask.findMany({
      orderBy: [{ section: "asc" }, { deadline: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  const done = tasks.filter((t) => t.done).length;
  const overdue = tasks.filter(
    (t) => !t.done && t.deadline && (daysUntil(t.deadline) ?? 0) < 0,
  ).length;
  const soon = tasks.filter((t) => {
    if (t.done || !t.deadline) return false;
    const days = daysUntil(t.deadline) ?? 0;
    return days >= 0 && days <= 14;
  }).length;

  const groups = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const bucket = groups.get(task.section);
    if (bucket) bucket.push(task);
    else groups.set(task.section, [task]);
  }

  return (
    <>
      <PageHeader
        title="Vendor Checklist"
        subtitle="To-do dengan countdown"
        action={<ChecklistTaskSheet />}
      />

      <div className="flex flex-col gap-4 p-4">
        {profile.weddingDate ? (
          <div className="bg-primary text-primary-foreground rounded-xl p-4">
            <p className="text-[11px] opacity-80">Hari H</p>
            <p className="text-lg font-bold">
              {countdownLabel(profile.weddingDate)}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-90">
              <CalendarDays className="size-3.5" />
              {formatDateShort(profile.weddingDate)}
            </p>
          </div>
        ) : null}

        <StatGrid>
          <StatCard
            label="Lewat Deadline"
            value={`${overdue} kegiatan`}
            hint="Segera dikejar"
            tone={overdue > 0 ? "negative" : "default"}
          />
          <StatCard
            label="Dalam 14 Hari"
            value={`${soon} kegiatan`}
            hint="Deadline terdekat"
            tone="accent"
          />
        </StatGrid>

        <ProgressCard label="Progress checklist" done={done} total={tasks.length} />

        {tasks.length === 0 ? (
          <EmptyState
            title="Belum ada kegiatan"
            description='Tekan "Tambah" untuk menyusun to-do vendor.'
          />
        ) : (
          [...groups.entries()].map(([section, sectionTasks]) => (
            <section key={section} className="flex flex-col gap-2">
              <SectionTitle
                right={
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {sectionTasks.filter((t) => t.done).length}/
                    {sectionTasks.length}
                  </span>
                }
              >
                {section}
              </SectionTitle>

              {sectionTasks.map((task) => {
                const days = daysUntil(task.deadline);
                const late = !task.done && days !== null && days < 0;
                const urgent = !task.done && days !== null && days >= 0 && days <= 14;
                return (
                  <div key={task.id} className="bg-card rounded-xl border p-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <ToggleCheck
                          id={task.id}
                          checked={task.done}
                          action={toggleChecklistTask}
                          ariaLabel={`Tandai ${task.name} selesai`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm leading-tight font-medium",
                            task.done && "text-muted-foreground line-through",
                          )}
                        >
                          {task.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {task.subSection ? (
                            <span className="text-muted-foreground text-[11px]">
                              {task.subSection}
                            </span>
                          ) : null}
                          {task.deadline ? (
                            <span
                              className={cn(
                                "text-[11px] font-medium",
                                task.done
                                  ? "text-muted-foreground"
                                  : late
                                    ? "text-rose-600"
                                    : urgent
                                      ? "text-amber-600"
                                      : "text-muted-foreground",
                              )}
                            >
                              {formatDateShort(task.deadline)} ·{" "}
                              {countdownLabel(task.deadline)}
                            </span>
                          ) : null}
                        </div>
                        {task.note ? (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {task.note}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-1 flex justify-end gap-1">
                      <ChecklistTaskSheet
                        task={{
                          id: task.id,
                          section: task.section,
                          subSection: task.subSection,
                          name: task.name,
                          deadline: toDateInputValue(task.deadline),
                          done: task.done,
                          note: task.note,
                        }}
                      />
                      <DeleteButton id={task.id} action={deleteChecklistTask} />
                    </div>
                  </div>
                );
              })}
            </section>
          ))
        )}
      </div>
    </>
  );
}
