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

export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type ObjectRow = Tables<"objects">;
export type ObjectInsert = TablesInsert<"objects">;
export type ObjectUpdate = TablesUpdate<"objects">;
