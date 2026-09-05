"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  ComboField,
  MoneyField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { vendorStatusOptions } from "@/lib/labels";
import type { BudgetScope, VendorStatus } from "@/generated/prisma/enums";
import { createBudgetItem, updateBudgetItem } from "./actions";

export type BudgetItemInput = {
  id: string;
  category: string;
  detail: string;
  status: VendorStatus;
  vendor: string | null;
  totalCost: number;
  note: string | null;
  term1: number;
  term2: number;
  term3: number;
  term4: number;
};

export function BudgetItemSheet({
  scope,
  categories,
  showTerms,
  item,
  defaultCategory,
}: {
  scope: BudgetScope;
  categories: string[];
  showTerms: boolean;
  item?: BudgetItemInput;
  defaultCategory?: string;
}) {
  const editing = Boolean(item);

  return (
    <FormSheet
      title={editing ? "Ubah Item" : "Tambah Item"}
      description="Satu baris biaya beserta vendor dan pembayarannya."
      action={editing ? updateBudgetItem : createBudgetItem}
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
      <input type="hidden" name="scope" value={scope} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <TextField
        name="detail"
        label="Detail"
        defaultValue={item?.detail}
        placeholder="Dekorasi, Catering, Mahar..."
        required
      />
      <ComboField
        name="category"
        label="Kategori"
        options={categories}
        defaultValue={item?.category ?? defaultCategory ?? categories[0]}
        placeholder="VENUE"
        required
      />
      <SelectField
        name="status"
        label="Status"
        options={vendorStatusOptions}
        defaultValue={item?.status ?? "CHOOSE_VENDOR"}
      />
      <TextField
        name="vendor"
        label="Vendor"
        defaultValue={item?.vendor}
        placeholder="Nama vendor / toko"
      />
      <MoneyField
        name="totalCost"
        label="Total Biaya"
        defaultValue={item?.totalCost}
      />

      {showTerms ? (
        <div className="grid grid-cols-2 gap-3">
          <MoneyField name="term1" label="Termin 1" defaultValue={item?.term1} />
          <MoneyField name="term2" label="Termin 2" defaultValue={item?.term2} />
          <MoneyField name="term3" label="Termin 3" defaultValue={item?.term3} />
          <MoneyField name="term4" label="Termin 4" defaultValue={item?.term4} />
        </div>
      ) : null}

      <TextAreaField
        name="note"
        label="Keterangan"
        defaultValue={item?.note}
        placeholder="estimasi, sudah lunas, sponsor nenek..."
      />
    </FormSheet>
  );
}
