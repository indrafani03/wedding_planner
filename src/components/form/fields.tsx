"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  required,
  type = "text",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
      />
    </Field>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <Textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
      />
    </Field>
  );
}

/** Numeric keypad + thousand separators as you type. */
export function MoneyField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
          Rp
        </span>
        <Input
          id={name}
          name={name}
          inputMode="numeric"
          className="pl-9"
          defaultValue={
            defaultValue ? new Intl.NumberFormat("id-ID").format(defaultValue) : ""
          }
          placeholder="0"
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            event.target.value = digits
              ? new Intl.NumberFormat("id-ID").format(Number(digits))
              : "";
          }}
        />
      </div>
    </Field>
  );
}

export function NumberField({
  name,
  label,
  defaultValue,
  min = 0,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
  min?: number;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <Input
        id={name}
        name={name}
        type="number"
        inputMode="numeric"
        min={min}
        defaultValue={defaultValue ?? ""}
      />
    </Field>
  );
}

export function DateField({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <Input
        id={name}
        name={name}
        type="date"
        defaultValue={defaultValue ?? ""}
        required={required}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  name,
  label,
  options,
  defaultValue,
  placeholder = "Pilih...",
}: {
  name: string;
  label: string;
  options: readonly { value: T; label: string }[];
  defaultValue?: T;
  placeholder?: string;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

/** Free-text with suggestions, used for the category/section columns. */
export function ComboField({
  name,
  label,
  options,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  options: readonly string[];
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  const listId = `${name}-options`;
  return (
    <Field label={label} htmlFor={name}>
      <Input
        id={name}
        name={name}
        list={listId}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </Field>
  );
}
