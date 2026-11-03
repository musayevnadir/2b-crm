"use client";

import { useRouter } from "next/navigation";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { createClient } from "@/lib/supabase/client";
import { TasksAPI } from "@/services/api/tasks.api";
import type { PersonShort, TaskDetail } from "@/types";

import { TaskFormDialog } from "./task-form-dialog";

type TaskManageActionsProps = {
  task: TaskDetail;
  executors: PersonShort[];
};

export function TaskManageActions({ task, executors }: TaskManageActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    const response = await TasksAPI.remove(createClient(), task.id);
    if (!response.result) {
      toast.error("Не удалось удалить задачу");
      return false;
    }
    toast.success("Задача удалена");
    router.replace(ROUTES.object(task.object_id));
    router.refresh();
    return true;
  }

  return (
    <div className="flex gap-2">
      <TaskFormDialog
        objectId={task.object_id}
        executors={executors}
        task={task}
        trigger={
          <Button variant="outline">
            <Pencil className="size-4" />
            Изменить
          </Button>
        }
      />
      <ConfirmDialog
        trigger={
          <Button variant="outline" className="text-destructive">
            <Trash2 className="size-4" />
            Удалить
          </Button>
        }
        title="Удалить задачу?"
        description={`«${task.title}» будет удалена вместе с историей. Это действие нельзя отменить.`}
        confirmText="Удалить"
        onConfirm={handleDelete}
      />
    </div>
  );
}
