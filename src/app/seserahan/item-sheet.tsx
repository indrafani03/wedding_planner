"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  ComboField,
  MoneyField,
  NumberField,
  TextField,
} from "@/components/form/fields";
import { createSeserahanItem, updateSeserahanItem } from "./actions";

export const SESERAHAN_CATEGORIES = [
  "ALAT SHOLAT",
  "PAKAIAN",
  "ACCESSORIES",
  "HAIR CARE",
  "BODY CARE & TOILETRIES",
  "SKINCARE",
  "MAKEUP",
];

export type SeserahanItemInput = {
  id: string;
  category: string;
  detail: string;
  brand: string | null;
  qty: number;
  link: string | null;
  budget: number;
  actualPrice: number;
  checked: boolean;
};

export function SeserahanItemSheet({ item }: { item?: SeserahanItemInput }) {
  const editing = Boolean(item);

  return (
    <FormSheet
      title={editing ? "Ubah Seserahan" : "Tambah Seserahan"}
      description="Detail hantaran, brand, dan budget-nya."
      action={editing ? updateSeserahanItem : createSeserahanItem}
      successMessage={editing ? "Seserahan diperbarui" : "Seserahan ditambahkan"}
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
      {item ? (
        <input type="hidden" name="checked" value={item.checked ? "on" : ""} />
      ) : null}

      <TextField
        name="detail"
        label="Detail"
        defaultValue={item?.detail}
        placeholder="Mukena, Sajadah, Parfum..."
        required
      />
      <ComboField
        name="category"
        label="Kategori"
        options={SESERAHAN_CATEGORIES}
        defaultValue={item?.category ?? SESERAHAN_CATEGORIES[0]}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          name="brand"
          label="Brand"
          defaultValue={item?.brand}
          placeholder="Scarlett, Wardah..."
        />
        <NumberField name="qty" label="Qty" defaultValue={item?.qty ?? 1} min={1} />
      </div>
      <MoneyField name="budget" label="Budget" defaultValue={item?.budget} />
      <MoneyField
        name="actualPrice"
        label="Harga Sebenarnya"
        defaultValue={item?.actualPrice}
      />
      <TextField
        name="link"
        label="Link Produk"
        type="url"
        defaultValue={item?.link}
        placeholder="https://..."
      />
    </FormSheet>
  );
}
