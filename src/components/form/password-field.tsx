"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

type PasswordFieldProps = {
  id: string;
  label: React.ReactNode;
  error?: string;
  registration: UseFormRegisterReturn;
} & Omit<React.ComponentProps<"input">, "id" | "type">;

export function PasswordField({
  id,
  label,
  error,
  registration,
  ...input
}: PasswordFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <PasswordInput
        id={id}
        aria-invalid={!!error}
        {...input}
        {...registration}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
