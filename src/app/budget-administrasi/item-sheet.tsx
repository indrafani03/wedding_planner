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
import {
  planVsActual,
  SummaryBox,
  useLiveNumbers,
} from "@/components/form/live-summary";
import { formatIDR } from "@/lib/format";
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
      <PriceFields item={item} />
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

/** Qty + estimate + real price, with a live "hemat / over" box underneath. */
function PriceFields({ item }: { item?: AdminBudgetItemInput }) {
  const [values, onInput] = useLiveNumbers({
    qty: item?.qty ?? 1,
    estimationPrice: item?.estimationPrice ?? 0,
    realPrice: item?.realPrice ?? 0,
  });
  const result = planVsActual(values.estimationPrice, values.realPrice, values.qty);

  return (
    <div onInput={onInput} className="flex flex-col gap-4">
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
        label="Estimasi Harga (per item)"
        defaultValue={item?.estimationPrice}
      />
      <MoneyField
        name="realPrice"
        label="Harga Real (per item)"
        defaultValue={item?.realPrice}
      />
      <SummaryBox
        tone={result.tone}
        left={{ label: `Total estimasi ×${values.qty}`, value: formatIDR(result.planTotal) }}
        right={{
          label: result.label,
          value: typeof result.text === "number" ? formatIDR(result.text) : result.text,
        }}
        note={
          values.realPrice > 0
            ? `Total real ${formatIDR(result.actualTotal)}`
            : undefined
        }
      />
    </div>
  );
}
