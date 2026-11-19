"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  DateField,
  MoneyField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { cashflowTypeOptions } from "@/lib/labels";
import { todayInputValue } from "@/lib/format";
import { createCashflowEntry, updateCashflowEntry } from "./actions";

export type CashflowEntryInput = {
  id: string;
  date: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  party: "CPP" | "CPW";
  amount: number;
  note: string | null;
};

export function CashflowEntrySheet({
  entry,
  groomName,
  brideName,
}: {
  entry?: CashflowEntryInput;
  groomName: string;
  brideName: string;
}) {
  const editing = Boolean(entry);
  const parties = [
    { value: "CPP" as const, label: `CPP · ${groomName}` },
    { value: "CPW" as const, label: `CPW · ${brideName}` },
  ];

  return (
    <FormSheet
      title={editing ? "Ubah Catatan" : "Tambah Catatan"}
      description="Tabungan, pemasukan, atau pengeluaran persiapan pernikahan."
      action={editing ? updateCashflowEntry : createCashflowEntry}
      successMessage={editing ? "Catatan diperbarui" : "Catatan ditambahkan"}
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
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <DateField
        name="date"
        label="Tanggal"
        defaultValue={entry?.date ?? todayInputValue()}
        required
      />
      <TextField
        name="description"
        label="Keterangan"
        defaultValue={entry?.description}
        placeholder="Tabungan, THR, bayar DP dekorasi..."
        required
      />
      <SelectField
        name="type"
        label="Jenis"
        options={cashflowTypeOptions}
        defaultValue={entry?.type ?? "INCOME"}
      />
      <SelectField
        name="party"
        label="Dari / Oleh"
        options={parties}
        defaultValue={entry?.party ?? "CPP"}
      />
      <MoneyField name="amount" label="Nominal" defaultValue={entry?.amount} />
      <TextAreaField name="note" label="Catatan" defaultValue={entry?.note} />
    </FormSheet>
  );
}
