import type { TaskStatus, UserRole } from "@/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: "Постановщик",
  executor: "Исполнитель",
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  review: "На проверке",
  accepted: "Принята",
  rework: "На доработке",
};
