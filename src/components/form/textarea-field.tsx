"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = {
  id: string;
  label: React.ReactNode;
  error?: string;
  registration: UseFormRegisterReturn;
} & Omit<React.ComponentProps<"textarea">, "id">;

export function TextareaField({
  id,
  label,
  error,
  registration,
  ...textarea
}: TextareaFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        aria-invalid={!!error}
        {...textarea}
        {...registration}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
