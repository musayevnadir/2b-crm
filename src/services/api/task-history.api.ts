import { EndpointResources } from "@/services/EndpointResources.g";
import { errorHandler, responseHandler } from "@/services/networking";
import type { DbClient, IResponse, TaskHistoryItem } from "@/types";

export const TaskHistoryAPI = {
  async listByTask(
    client: DbClient,
    taskId: string,
  ): Promise<IResponse<TaskHistoryItem[]>> {
    try {
      const result = await client
        .from(EndpointResources.tables.taskHistory)
        .select(
          "*, changed_by_profile:profiles!task_history_changed_by_fkey(id, first_name, last_name, email)",
        )
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },
};
