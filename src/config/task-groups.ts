import type { TaskStatus } from "@/types";

export const EXECUTOR_TODO_STATUSES: TaskStatus[] = [
  "new",
  "in_progress",
  "rework",
];

export function isExecutorTodo(status: TaskStatus) {
  return EXECUTOR_TODO_STATUSES.includes(status);
}
