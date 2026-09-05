import { PageHeader } from "@/components/page-header";
import { getProfile } from "@/lib/profile";
import { toDateInputValue } from "@/lib/format";
import { ProfileForm } from "./profile-form";
import { SecurityCard } from "./security-card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Pengaturan"
        subtitle="Data dasar pernikahan kamu"
      />
      <div className="flex flex-col gap-4 p-4">
        <ProfileForm
          profile={{
            groomName: profile.groomName,
            brideName: profile.brideName,
            weddingDate: toDateInputValue(profile.weddingDate),
            engagementDate: toDateInputValue(profile.engagementDate),
            savingTarget: profile.savingTarget,
            venue: profile.venue,
          }}
        />
        <SecurityCard />
      </div>
    </>
  );
}
