"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormDialog,
  FormError,
  SubmitButton,
  TextareaField,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

const reworkSchema = z.object({
  comment: z.string().trim().min(1, "Комментарий обязателен").max(1000),
});

type ReworkValues = z.infer<typeof reworkSchema>;

type ReworkDialogProps = {
  trigger: React.ReactNode;
  onSubmit: (comment: string) => Promise<string | null>;
};

export function ReworkDialog({ trigger, onSubmit }: ReworkDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReworkValues>({
    resolver: zodResolver(reworkSchema),
    defaultValues: { comment: "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset({ comment: "" });
      setServerError(null);
    }
  }

  async function submit(values: ReworkValues) {
    setServerError(null);
    const error = await onSubmit(values.comment);
    if (error) {
      setServerError(error);
      return;
    }
    handleOpenChange(false);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title="Вернуть на доработку"
      description="Исполнитель увидит комментарий в истории задачи"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <FieldGroup>
          <TextareaField
            id="comment"
            label="Что нужно исправить"
            rows={4}
            disabled={isSubmitting}
            error={errors.comment?.message}
            registration={register("comment")}
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
            <SubmitButton loading={isSubmitting} loadingText="Отправляем…">
              Вернуть
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
