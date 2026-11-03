"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "@/components/form";
import { FieldGroup } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { AuthAPI } from "@/services/api/auth.api";

import { loginSchema, type LoginValues } from "../schemas/auth.schemas";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    const response = await AuthAPI.signIn(createClient(), values);

    if (!response.result) {
      setServerError("Неверный email или пароль");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.ru"
          disabled={isSubmitting}
          error={errors.email?.message}
          registration={register("email")}
        />
        <PasswordField
          id="password"
          label="Пароль"
          disabled={isSubmitting}
          autoComplete="current-password"
          error={errors.password?.message}
          registration={register("password")}
        />
        <FormError message={serverError} />
        <SubmitButton loading={isSubmitting} loadingText="Входим…">
          Войти
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}
