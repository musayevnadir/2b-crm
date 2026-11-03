import type { User } from "@supabase/supabase-js";

import { errorHandler, responseHandler } from "@/services/networking";
import type { DbClient, IResponse } from "@/types";

export const AuthAPI = {
  async signIn(
    client: DbClient,
    payload: { email: string; password: string },
  ): Promise<IResponse<{ user: User | null }>> {
    try {
      const { data, error } = await client.auth.signInWithPassword(payload);
      return responseHandler({ data: { user: data.user }, error });
    } catch (e) {
      return errorHandler(e);
    }
  },

  async signOut(client: DbClient): Promise<IResponse<null>> {
    try {
      const { error } = await client.auth.signOut();
      return responseHandler({ data: null, error });
    } catch (e) {
      return errorHandler(e);
    }
  },

  async getUser(client: DbClient): Promise<IResponse<User | null>> {
    try {
      const { data, error } = await client.auth.getUser();
      return responseHandler({ data: data.user, error });
    } catch (e) {
      return errorHandler(e);
    }
  },
};
