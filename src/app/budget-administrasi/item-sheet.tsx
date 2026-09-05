"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  ComboField,
  MoneyField,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { todoStatusOptions } from "@/lib/labels";
import type { TodoStatus } from "@/generated/prisma/enums";
import { createAdminBudgetItem, updateAdminBudgetItem } from "./actions";

export const ADMIN_CATEGORIES = [
  "Administrasi",
  "Tempat",
  "Mahar & Seserahan",
  "Makeup & Baju",
  "Dokumentasi",
  "Makanan",
  "Undangan & Souvenir",
  "Pengisi Acara",
  "Lain-lain",
];

export type AdminBudgetItemInput = {
  id: string;
  category: string;
  name: string;
  handledBy: string | null;
  qty: number;
  estimationPrice: number;
  realPrice: number;
  status: TodoStatus;
  note: string | null;
};

export function AdminBudgetItemSheet({
  item,
}: {
  item?: AdminBudgetItemInput;
}) {
  const editing = Boolean(item);

  return (
    <FormSheet
      title={editing ? "Ubah Item" : "Tambah Item"}
      description="Bandingkan estimasi dengan harga sebenarnya."
      action={editing ? updateAdminBudgetItem : createAdminBudgetItem}
      successMessage={editing ? "Item diperbarui" : "Item ditambahkan"}
      trigger={
        editing ? (
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
            <Pencil className="size-3.5" />
            Ubah
          </Button>
        ) : (
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Tambah
          </Button>
        )
      }
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <TextField
        name="name"
        label="Nama"
        defaultValue={item?.name}
        placeholder="Daftar ke KUA, MUA Pengantin..."
        required
      />
      <ComboField
        name="category"
        label="Kategori"
        options={ADMIN_CATEGORIES}
        defaultValue={item?.category ?? ADMIN_CATEGORIES[0]}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          name="handledBy"
          label="Ditangani (by)"
          defaultValue={item?.handledBy}
          placeholder="CPP / CPW"
        />
        <NumberField name="qty" label="Qty" defaultValue={item?.qty ?? 1} min={0} />
      </div>
      <MoneyField
        name="estimationPrice"
        label="Estimasi Harga"
        defaultValue={item?.estimationPrice}
      />
      <MoneyField
        name="realPrice"
        label="Harga Real"
        defaultValue={item?.realPrice}
      />
      <SelectField
        name="status"
        label="Status"
        options={todoStatusOptions}
        defaultValue={item?.status ?? "NOT_YET"}
      />
      <TextAreaField name="note" label="Keterangan" defaultValue={item?.note} />
    </FormSheet>
  );
}
