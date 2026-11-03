import { EndpointResources } from "@/services/EndpointResources.g";
import { errorHandler, responseHandler } from "@/services/networking";
import type { DbClient, IResponse, PersonShort, Profile } from "@/types";

export const ProfilesAPI = {
  async getById(
    client: DbClient,
    id: string,
  ): Promise<IResponse<Profile | null>> {
    try {
      const result = await client
        .from(EndpointResources.tables.profiles)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async listExecutors(client: DbClient): Promise<IResponse<PersonShort[]>> {
    try {
      const result = await client
        .from(EndpointResources.tables.profiles)
        .select("id, first_name, last_name, email")
        .eq("role", "executor")
        .order("last_name");
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },
};
