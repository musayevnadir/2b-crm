import type { Profile, Task, TaskHistory } from "./database.types";

export type PersonShort = Pick<
  Profile,
  "id" | "first_name" | "last_name" | "email"
>;

export type TaskListItem = Pick<
  Task,
  "id" | "title" | "status" | "created_at" | "object_id"
> & {
  object: { id: string; name: string } | null;
  assignee: PersonShort | null;
};

export type TaskDetail = Task & {
  object: { id: string; name: string; address: string } | null;
  assignee: PersonShort | null;
  author: PersonShort | null;
};

export type TaskHistoryItem = TaskHistory & {
  changed_by_profile: PersonShort | null;
};
