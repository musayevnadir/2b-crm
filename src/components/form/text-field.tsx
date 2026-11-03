"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextFieldProps = {
  id: string;
  label: React.ReactNode;
  error?: string;
  registration: UseFormRegisterReturn;
} & Omit<React.ComponentProps<"input">, "id">;

export function TextField({
  id,
  label,
  error,
  registration,
  ...input
}: TextFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={!!error} {...input} {...registration} />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
