"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  FormDialog,
  FormError,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { fullName } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { TasksAPI } from "@/services/api/tasks.api";
import type { PersonShort, TaskDetail } from "@/types";

import { taskSchema, type TaskValues } from "../schemas/tasks.schemas";

type TaskFormDialogProps = {
  objectId: string;
  executors: PersonShort[];
  task?: Pick<TaskDetail, "id" | "title" | "description" | "assignee_id">;
  trigger: React.ReactNode;
};

export function TaskFormDialog({
  objectId,
  executors,
  task,
  trigger,
}: TaskFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!task;

  const defaults: TaskValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    assignee_id: task?.assignee_id ?? "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaults,
  });

  const options = executors.map((person) => ({
    value: person.id,
    label: fullName(person),
  }));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset(defaults);
      setServerError(null);
    }
  }

  async function onSubmit(values: TaskValues) {
    setServerError(null);
    const client = createClient();
    const response = isEdit
      ? await TasksAPI.update(client, task.id, values)
      : await TasksAPI.create(client, { ...values, object_id: objectId });

    if (!response.result) {
      setServerError("Не удалось сохранить задачу");
      return;
    }

    toast.success(isEdit ? "Задача обновлена" : "Задача создана");
    setOpen(false);
    if (!isEdit) reset(defaults);
    router.refresh();
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={isEdit ? "Редактировать задачу" : "Новая задача"}
      description="Исполнитель увидит задачу в разделе «Мои задачи»"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <TextField
            id="title"
            label="Название"
            placeholder="Залить фундамент"
            disabled={isSubmitting}
            error={errors.title?.message}
            registration={register("title")}
          />
          <TextareaField
            id="description"
            label="Описание"
            placeholder="Что нужно сделать, сроки, материалы…"
            rows={4}
            disabled={isSubmitting}
            error={errors.description?.message}
            registration={register("description")}
          />
          <Controller
            control={control}
            name="assignee_id"
            render={({ field }) => (
              <SelectField
                id="assignee_id"
                label="Исполнитель"
                placeholder="Выберите исполнителя"
                options={options}
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                error={errors.assignee_id?.message}
              />
            )}
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
