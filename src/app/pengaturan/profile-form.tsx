"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DateField,
  MoneyField,
  TextField,
} from "@/components/form/fields";
import { saveProfile } from "./actions";

export function ProfileForm({
  profile,
}: {
  profile: {
    groomName: string;
    brideName: string;
    weddingDate: string;
    engagementDate: string;
    savingTarget: number;
    venue: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await saveProfile(formData);
              if (result.ok) toast.success("Pengaturan tersimpan");
              else toast.error(result.message ?? "Gagal menyimpan");
            });
          }}
        >
          <TextField
            name="groomName"
            label="Nama CPP (Calon Pengantin Pria)"
            defaultValue={profile.groomName}
            required
          />
          <TextField
            name="brideName"
            label="Nama CPW (Calon Pengantin Wanita)"
            defaultValue={profile.brideName}
            required
          />
          <DateField
            name="engagementDate"
            label="Tanggal Lamaran"
            defaultValue={profile.engagementDate}
          />
          <DateField
            name="weddingDate"
            label="Tanggal Pernikahan"
            defaultValue={profile.weddingDate}
          />
          <TextField
            name="venue"
            label="Lokasi Acara"
            defaultValue={profile.venue}
            placeholder="Balai RW, Gedung, dll"
          />
          <MoneyField
            name="savingTarget"
            label="Target Tabungan / Budget Pernikahan"
            defaultValue={profile.savingTarget}
            hint="Dipakai untuk menghitung sisa yang harus ditabung."
          />
          <Button type="submit" disabled={pending} className="h-11 w-full">
            {pending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
