"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/config/labels";
import {
  getAvailableActions,
  type TaskAction,
} from "@/config/task-transitions";
import { dbErrorMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/client";
import { TasksAPI } from "@/services/api/tasks.api";
import type { TaskStatus } from "@/types";

import { ReworkDialog } from "./rework-dialog";

type TaskStatusActionsProps = {
  taskId: string;
  status: TaskStatus;
  isManager: boolean;
  isAssignee: boolean;
};

export function TaskStatusActions({
  taskId,
  status,
  isManager,
  isAssignee,
}: TaskStatusActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<TaskStatus | null>(null);
  const actions = getAvailableActions(status, { isManager, isAssignee });

  async function change(action: TaskAction, comment?: string) {
    setPending(action.to);
    const response = await TasksAPI.changeStatus(createClient(), {
      taskId,
      status: action.to,
      comment,
    });
    setPending(null);

    if (!response.result) {
      const message = dbErrorMessage(
        response.message,
        "Не удалось сменить статус",
      );
      toast.error(message);
      return message;
    }

    toast.success(`Статус: ${STATUS_LABELS[action.to]}`);
    router.refresh();
    return null;
  }

  if (actions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {status === "accepted"
          ? "Задача принята — действий больше нет"
          : "Сейчас действие за другим участником"}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) =>
        action.requiresComment ? (
          <ReworkDialog
            key={action.to}
            trigger={
              <Button variant={action.variant} disabled={pending !== null}>
                {action.label}
              </Button>
            }
            onSubmit={(comment) => change(action, comment)}
          />
        ) : (
          <Button
            key={action.to}
            variant={action.variant}
            disabled={pending !== null}
            onClick={() => change(action)}
          >
            {pending === action.to && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {action.label}
          </Button>
        ),
      )}
    </div>
  );
}
