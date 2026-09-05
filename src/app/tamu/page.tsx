import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { StatCard, StatGrid, SectionTitle } from "@/components/stat";
import { DeleteButton } from "@/components/form/delete-button";
import { ToggleCheck } from "@/components/form/toggle-check";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/format";
import { invitationTypeLabel } from "@/lib/labels";
import type { Attendance, Party } from "@/generated/prisma/enums";
import { deleteGuest, toggleGuestInvited } from "./actions";
import { AttendanceToggle } from "./attendance-toggle";
import { GuestFilters } from "./guest-filters";
import { GuestSheet } from "./guest-sheet";

export const dynamic = "force-dynamic";

const SIDES: Party[] = ["CPP", "CPW"];
const ATTENDANCE: Attendance[] = ["HADIR", "TIDAK_HADIR", "BELUM_KONFIRMASI"];

export default async function GuestsPage({
  searchParams,
}: PageProps<"/tamu">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const side = SIDES.find((s) => s === params.side);
  const attendance = ATTENDANCE.find((a) => a === params.attendance);

  const [guests, all] = await Promise.all([
    prisma.guest.findMany({
      where: {
        ...(side ? { side } : {}),
        ...(attendance ? { attendance } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { origin: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: [{ side: "asc" }, { createdAt: "asc" }],
    }),
    prisma.guest.findMany({
      select: {
        side: true,
        attendance: true,
        invitationType: true,
        invited: true,
        pax: true,
      },
    }),
  ]);

  const count = (predicate: (g: (typeof all)[number]) => boolean) =>
    all.filter(predicate).length;

  const hadirPax = all
    .filter((g) => g.attendance === "HADIR")
    .reduce((sum, g) => sum + g.pax, 0);

  return (
    <>
      <PageHeader
        title="Daftar Tamu"
        subtitle={`${all.length} undangan terdata`}
        action={<GuestSheet />}
      />

      <div className="flex flex-col gap-4 p-4">
        <StatGrid>
          <StatCard
            label="Kemungkinan Hadir"
            value={formatNumber(count((g) => g.attendance === "HADIR"))}
            hint={`± ${formatNumber(hadirPax)} orang untuk konsumsi`}
            tone="positive"
          />
          <StatCard
            label="Tidak Hadir"
            value={formatNumber(count((g) => g.attendance === "TIDAK_HADIR"))}
            hint={`${count((g) => g.attendance === "BELUM_KONFIRMASI")} belum konfirmasi`}
            tone="negative"
          />
          <StatCard
            label="Undangan Fisik"
            value={formatNumber(count((g) => g.invitationType === "FISIK"))}
            hint="Perlu dicetak"
          />
          <StatCard
            label="Undangan Digital"
            value={formatNumber(count((g) => g.invitationType === "DIGITAL"))}
            hint={`${count((g) => g.invited)} sudah dikirim`}
          />
        </StatGrid>

        <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
          <GuestFilters />
        </Suspense>

        <SectionTitle>
          Hasil ({guests.length}) · CPP {count((g) => g.side === "CPP")} / CPW{" "}
          {count((g) => g.side === "CPW")}
        </SectionTitle>

        {guests.length === 0 ? (
          <EmptyState
            title={all.length === 0 ? "Belum ada tamu" : "Tidak ada yang cocok"}
            description={
              all.length === 0
                ? 'Tekan "Tambah" untuk mulai mendata undangan.'
                : "Coba ubah kata kunci atau filter."
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {guests.map((guest) => (
              <li key={guest.id} className="bg-card rounded-xl border p-3">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <ToggleCheck
                      id={guest.id}
                      checked={guest.invited}
                      action={toggleGuestInvited}
                      ariaLabel={`Tandai undangan ${guest.name} sudah dikirim`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight font-semibold">
                      {guest.name}
                      {guest.pax > 1 ? (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          ({guest.pax} org)
                        </span>
                      ) : null}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {guest.side}
                      </Badge>
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                        {invitationTypeLabel[guest.invitationType]}
                      </Badge>
                      {guest.origin ? (
                        <span className="text-muted-foreground text-[11px]">
                          {guest.origin}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <AttendanceToggle id={guest.id} attendance={guest.attendance} />
                  <div className="flex gap-1">
                    <GuestSheet
                      guest={{
                        id: guest.id,
                        name: guest.name,
                        origin: guest.origin,
                        side: guest.side,
                        invitationType: guest.invitationType,
                        attendance: guest.attendance,
                        invited: guest.invited,
                        pax: guest.pax,
                        phone: guest.phone,
                        note: guest.note,
                      }}
                    />
                    <DeleteButton id={guest.id} action={deleteGuest} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
