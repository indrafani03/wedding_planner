"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { SummaryBox, useLiveNumbers } from "@/components/form/live-summary";
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
      {showTerms ? (
        <PaymentFields item={item} />
      ) : (
        <MoneyField
          name="totalCost"
          label="Total Biaya"
          defaultValue={item?.totalCost}
        />
      )}

      <TextAreaField
        name="note"
        label="Keterangan"
        defaultValue={item?.note}
        placeholder="estimasi, sudah lunas, sponsor nenek..."
      />
    </FormSheet>
  );
}

/** Total cost + 4 terms, with a live "paid / remaining" box underneath. */
function PaymentFields({ item }: { item?: BudgetItemInput }) {
  const [values, onInput] = useLiveNumbers({
    totalCost: item?.totalCost ?? 0,
    term1: item?.term1 ?? 0,
    term2: item?.term2 ?? 0,
    term3: item?.term3 ?? 0,
    term4: item?.term4 ?? 0,
  });

  const paid = values.term1 + values.term2 + values.term3 + values.term4;
  const remaining = values.totalCost - paid;
  const overpaid = remaining < 0;
  const settled = values.totalCost > 0 && remaining === 0;

  return (
    <div onInput={onInput} className="flex flex-col gap-4">
      <MoneyField
        name="totalCost"
        label="Total Biaya"
        defaultValue={item?.totalCost}
      />
      <div className="grid grid-cols-2 gap-3">
        <MoneyField name="term1" label="Termin 1" defaultValue={item?.term1} />
        <MoneyField name="term2" label="Termin 2" defaultValue={item?.term2} />
        <MoneyField name="term3" label="Termin 3" defaultValue={item?.term3} />
        <MoneyField name="term4" label="Termin 4" defaultValue={item?.term4} />
      </div>
      <SummaryBox
        tone={overpaid ? "bad" : settled ? "good" : "neutral"}
        left={{ label: "Sudah dibayar", value: formatIDR(paid) }}
        right={{
          label: overpaid ? "Lebih bayar" : "Sisa pembayaran",
          value: settled ? "Lunas" : formatIDR(Math.abs(remaining)),
        }}
        note={
          overpaid
            ? "Jumlah termin melebihi Total Biaya. Cek lagi nominalnya."
            : undefined
        }
      />
    </div>
  );
}
