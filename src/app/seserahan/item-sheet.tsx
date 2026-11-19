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
import {
  planVsActual,
  SummaryBox,
  useLiveNumbers,
} from "@/components/form/live-summary";
import { formatIDR } from "@/lib/format";
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
      <PriceFields item={item} />
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

/** Qty + budget + bought price, with a live "hemat / over" box underneath. */
function PriceFields({ item }: { item?: SeserahanItemInput }) {
  const [values, onInput] = useLiveNumbers({
    qty: item?.qty ?? 1,
    budget: item?.budget ?? 0,
    actualPrice: item?.actualPrice ?? 0,
  });
  const result = planVsActual(values.budget, values.actualPrice, values.qty);

  return (
    <div onInput={onInput} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <TextField
          name="brand"
          label="Brand"
          defaultValue={item?.brand}
          placeholder="Scarlett, Wardah..."
        />
        <NumberField name="qty" label="Qty" defaultValue={item?.qty ?? 1} min={1} />
      </div>
      <MoneyField name="budget" label="Budget (per item)" defaultValue={item?.budget} />
      <MoneyField
        name="actualPrice"
        label="Harga Sebenarnya (per item)"
        defaultValue={item?.actualPrice}
      />
      <SummaryBox
        tone={result.tone}
        left={{ label: `Total budget ×${values.qty}`, value: formatIDR(result.planTotal) }}
        right={{
          label: result.label,
          value: typeof result.text === "number" ? formatIDR(result.text) : result.text,
        }}
        note={
          values.actualPrice > 0
            ? `Total harga sebenarnya ${formatIDR(result.actualTotal)}`
            : undefined
        }
      />
    </div>
  );
}
