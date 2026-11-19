"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  ComboField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { progressOptions } from "@/lib/labels";
import type { Progress } from "@/generated/prisma/enums";
import { createDocumentItem, updateDocumentItem } from "./actions";

/** Groups A-M as laid out in the "ADMINISTRASI DAN DOKUMEN" sheet. */
export const DOCUMENT_GROUPS = [
  { code: "A", name: "Persiapan Awal" },
  { code: "B", name: "Administrasi Persiapan Pernikahan" },
  { code: "C", name: "Daftar ke KUA dan Bimbingan Pra Nikah" },
  { code: "D", name: "Tempat" },
  { code: "E", name: "Mahar & Seserahan" },
  { code: "F", name: "Makeup dan Busana" },
  { code: "G", name: "Dokumentasi" },
  { code: "H", name: "Makanan" },
  { code: "I", name: "Undangan & Souvenir" },
  { code: "J", name: "Pengisi Acara" },
  { code: "K", name: "Panitia" },
  { code: "L", name: "Persiapan lainnya" },
  { code: "M", name: "Tambahan" },
];

export type DocumentItemInput = {
  id: string;
  groupCode: string;
  groupName: string;
  name: string;
  progress: Progress;
  details: string | null;
};

export function DocumentItemSheet({ item }: { item?: DocumentItemInput }) {
  const editing = Boolean(item);

  return (
    <FormSheet
      title={editing ? "Ubah Dokumen" : "Tambah Dokumen"}
      description="Berkas atau persiapan yang harus diurus."
      action={editing ? updateDocumentItem : createDocumentItem}
      successMessage={editing ? "Dokumen diperbarui" : "Dokumen ditambahkan"}
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
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <TextField
        name="name"
        label="Nama Dokumen / Persiapan"
        defaultValue={item?.name}
        placeholder="Surat keterangan menikah (N1)"
        required
      />
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <TextField
          name="groupCode"
          label="Kode"
          defaultValue={item?.groupCode ?? "B"}
          required
        />
        <ComboField
          name="groupName"
          label="Grup"
          options={DOCUMENT_GROUPS.map((g) => g.name)}
          defaultValue={item?.groupName ?? DOCUMENT_GROUPS[1].name}
          required
        />
      </div>
      <SelectField
        name="progress"
        label="Progress"
        options={progressOptions}
        defaultValue={item?.progress ?? "BELUM"}
      />
      <TextAreaField
        name="details"
        label="Details"
        defaultValue={item?.details}
        placeholder="Diserahkan ke Desa/Kelurahan untuk dapat N1-N4"
      />
    </FormSheet>
  );
}
