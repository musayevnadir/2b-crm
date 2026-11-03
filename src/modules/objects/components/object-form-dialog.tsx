"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  FormDialog,
  FormError,
  SubmitButton,
  TextField,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { ObjectsAPI } from "@/services/api/objects.api";
import type { ObjectRow } from "@/types";

import { objectSchema, type ObjectValues } from "../schemas/objects.schemas";

type ObjectFormDialogProps = {
  object?: ObjectRow;
  trigger: React.ReactNode;
};

export function ObjectFormDialog({ object, trigger }: ObjectFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!object;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ObjectValues>({
    resolver: zodResolver(objectSchema),
    defaultValues: { name: object?.name ?? "", address: object?.address ?? "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset({ name: object?.name ?? "", address: object?.address ?? "" });
      setServerError(null);
    }
  }

  async function onSubmit(values: ObjectValues) {
    setServerError(null);
    const client = createClient();
    const response = isEdit
      ? await ObjectsAPI.update(client, object.id, values)
      : await ObjectsAPI.create(client, values);

    if (!response.result) {
      setServerError("Не удалось сохранить объект");
      return;
    }

    toast.success(isEdit ? "Объект обновлён" : "Объект создан");
    setOpen(false);
    if (!isEdit) reset({ name: "", address: "" });
    router.refresh();
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={isEdit ? "Редактировать объект" : "Новый объект"}
      description="Стройка, к которой будут привязаны задачи"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            id="name"
            label="Название"
            placeholder="ЖК «Северный»"
            disabled={isSubmitting}
            error={errors.name?.message}
            registration={register("name")}
          />
          <TextField
            id="address"
            label="Адрес"
            placeholder="г. Москва, ул. Лесная, 12"
            disabled={isSubmitting}
            error={errors.address?.message}
            registration={register("address")}
          />
          <FormError message={serverError} />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <SubmitButton loading={isSubmitting} loadingText="Сохраняем…">
              {isEdit ? "Сохранить" : "Создать"}
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
