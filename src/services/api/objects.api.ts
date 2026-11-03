import { EndpointResources } from "@/services/EndpointResources.g";
import { errorHandler, responseHandler } from "@/services/networking";
import type {
  DbClient,
  IResponse,
  ObjectInsert,
  ObjectRow,
  ObjectUpdate,
} from "@/types";

export const ObjectsAPI = {
  async list(client: DbClient): Promise<IResponse<ObjectRow[]>> {
    try {
      const result = await client
        .from(EndpointResources.tables.objects)
        .select("*")
        .order("created_at", { ascending: false });
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async getById(
    client: DbClient,
    id: string,
  ): Promise<IResponse<ObjectRow | null>> {
    try {
      const result = await client
        .from(EndpointResources.tables.objects)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async create(
    client: DbClient,
    payload: ObjectInsert,
  ): Promise<IResponse<ObjectRow>> {
    try {
      const result = await client
        .from(EndpointResources.tables.objects)
        .insert(payload)
        .select()
        .single();
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async update(
    client: DbClient,
    id: string,
    payload: ObjectUpdate,
  ): Promise<IResponse<ObjectRow>> {
    try {
      const result = await client
        .from(EndpointResources.tables.objects)
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async remove(client: DbClient, id: string): Promise<IResponse<null>> {
    try {
      const { error } = await client
        .from(EndpointResources.tables.objects)
        .delete()
        .eq("id", id);
      return responseHandler({ data: null, error });
    } catch (e) {
      return errorHandler(e);
    }
  },
};
