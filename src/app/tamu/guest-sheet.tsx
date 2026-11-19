"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import {
  attendanceOptions,
  invitationTypeOptions,
  partyOptions,
} from "@/lib/labels";
import type {
  Attendance,
  InvitationType,
  Party,
} from "@/generated/prisma/enums";
import { createGuest, updateGuest } from "./actions";

export type GuestInput = {
  id: string;
  name: string;
  origin: string | null;
  side: Party;
  invitationType: InvitationType;
  attendance: Attendance;
  invited: boolean;
  pax: number;
  phone: string | null;
  note: string | null;
};

export function GuestSheet({ guest }: { guest?: GuestInput }) {
  const editing = Boolean(guest);

  return (
    <FormSheet
      title={editing ? "Ubah Tamu" : "Tambah Tamu"}
      description="Data undangan dan konfirmasi kehadiran."
      action={editing ? updateGuest : createGuest}
      successMessage={editing ? "Tamu diperbarui" : "Tamu ditambahkan"}
      trigger={
        editing ? (
          <Button variant="ghost" className="h-11 gap-1.5 px-3">
            <Pencil className="size-3.5" />
            Ubah
          </Button>
        ) : (
          <Button className="h-11 gap-1.5 px-3">
            <Plus className="size-4" />
            Tambah
          </Button>
        )
      }
    >
      {guest ? <input type="hidden" name="id" value={guest.id} /> : null}
      {guest ? (
        <input type="hidden" name="invited" value={guest.invited ? "on" : ""} />
      ) : null}

      <TextField
        name="name"
        label="Nama Tamu"
        defaultValue={guest?.name}
        placeholder="Bapak Budi & Keluarga"
        required
      />
      <TextField
        name="origin"
        label="Asal Tamu"
        defaultValue={guest?.origin}
        placeholder="Teman kantor, keluarga, tetangga..."
      />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          name="side"
          label="Pihak"
          options={partyOptions}
          defaultValue={guest?.side ?? "CPP"}
        />
        <NumberField name="pax" label="Jumlah Orang" defaultValue={guest?.pax ?? 1} min={1} />
      </div>
      <SelectField
        name="invitationType"
        label="Jenis Undangan"
        options={invitationTypeOptions}
        defaultValue={guest?.invitationType ?? "FISIK"}
      />
      <SelectField
        name="attendance"
        label="Kehadiran"
        options={attendanceOptions}
        defaultValue={guest?.attendance ?? "BELUM_KONFIRMASI"}
      />
      <TextField
        name="phone"
        label="No. HP"
        type="tel"
        defaultValue={guest?.phone}
        placeholder="0812..."
      />
      <TextAreaField name="note" label="Catatan" defaultValue={guest?.note} />
    </FormSheet>
  );
}
