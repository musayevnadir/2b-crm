import type { PostgrestError } from "@supabase/supabase-js";

import type { IResponse } from "@/types";

export type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | { message: string } | null;
};

export const responseHandler = <T>(result: SupabaseResult<T>): IResponse<T> => {
  if (result.error) {
    return { data: null as T, result: false, message: result.error.message };
  }
  return { data: result.data as T, result: true };
};

export const errorHandler = <T = null>(error: unknown): IResponse<T> => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unexpected error";

  if (process.env.NODE_ENV === "development") {
    console.error("[networking] error:", error);
  }

  return { data: null as T, result: false, message };
};
