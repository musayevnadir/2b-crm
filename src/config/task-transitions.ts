import type { TaskStatus } from "@/types";

export type TaskAction = {
  to: TaskStatus;
  label: string;
  by: "assignee" | "manager";
  requiresComment?: boolean;
  variant: "default" | "outline" | "destructive";
};

const TRANSITIONS: Record<TaskStatus, TaskAction[]> = {
  new: [
    {
      to: "in_progress",
      label: "Взять в работу",
      by: "assignee",
      variant: "default",
    },
  ],
  in_progress: [
    {
      to: "review",
      label: "Отправить на проверку",
      by: "assignee",
      variant: "default",
    },
  ],
  review: [
    { to: "accepted", label: "Принять", by: "manager", variant: "default" },
    {
      to: "rework",
      label: "Вернуть на доработку",
      by: "manager",
      requiresComment: true,
      variant: "outline",
    },
  ],
  rework: [
    {
      to: "in_progress",
      label: "Взять в работу",
      by: "assignee",
      variant: "default",
    },
  ],
  accepted: [],
};

export function getAvailableActions(
  status: TaskStatus,
  user: { isManager: boolean; isAssignee: boolean },
): TaskAction[] {
  return TRANSITIONS[status].filter((action) =>
    action.by === "manager" ? user.isManager : user.isAssignee,
  );
}
