import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.generated";

export type DbClient = SupabaseClient<Database>;

export type UserRole = Enums<"user_role">;
export type TaskStatus = Enums<"task_status">;

export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type ObjectRow = Tables<"objects">;
export type ObjectInsert = TablesInsert<"objects">;
export type ObjectUpdate = TablesUpdate<"objects">;

export type Task = Tables<"tasks">;
export type TaskInsert = TablesInsert<"tasks">;
export type TaskUpdate = TablesUpdate<"tasks">;

export type TaskHistory = Tables<"task_history">;
export type TaskHistoryInsert = TablesInsert<"task_history">;
export type TaskHistoryUpdate = TablesUpdate<"task_history">;
