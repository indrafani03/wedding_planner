"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/form/form-sheet";
import {
  ComboField,
  DateField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { createChecklistTask, updateChecklistTask } from "./actions";

/** Sections as grouped in the "VENDOR CHECKLIST" sheet. */
export const CHECKLIST_SECTIONS = [
  "Booking Vendor",
  "Things To Do",
  "Administrasi Pernikahan",
  "Rangkaian Acara",
];

export type ChecklistTaskInput = {
  id: string;
  section: string;
  subSection: string | null;
  name: string;
  deadline: string;
  done: boolean;
  note: string | null;
};

export function ChecklistTaskSheet({ task }: { task?: ChecklistTaskInput }) {
  const editing = Boolean(task);

  return (
    <FormSheet
      title={editing ? "Ubah Kegiatan" : "Tambah Kegiatan"}
      description="Kegiatan dengan deadline dan countdown otomatis."
      action={editing ? updateChecklistTask : createChecklistTask}
      successMessage={editing ? "Kegiatan diperbarui" : "Kegiatan ditambahkan"}
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
      {task ? <input type="hidden" name="id" value={task.id} /> : null}
      {task ? (
        <input type="hidden" name="done" value={task.done ? "on" : ""} />
      ) : null}

      <TextField
        name="name"
        label="Kegiatan"
        defaultValue={task?.name}
        placeholder="Booking gedung wedding"
        required
      />
      <ComboField
        name="section"
        label="Bagian"
        options={CHECKLIST_SECTIONS}
        defaultValue={task?.section ?? CHECKLIST_SECTIONS[0]}
        required
      />
      <TextField
        name="subSection"
        label="Sub Bagian"
        defaultValue={task?.subSection}
        placeholder="Outfit, Undangan, dll (opsional)"
      />
      <DateField name="deadline" label="Deadline" defaultValue={task?.deadline} />
      <TextAreaField name="note" label="Keterangan" defaultValue={task?.note} />
    </FormSheet>
  );
}
