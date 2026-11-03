import { EndpointResources } from "@/services/EndpointResources.g";
import { errorHandler, responseHandler } from "@/services/networking";
import type {
  DbClient,
  IResponse,
  Task,
  TaskDetail,
  TaskInsert,
  TaskListItem,
  TaskStatus,
  TaskUpdate,
} from "@/types";

const PERSON = "id, first_name, last_name, email";

const LIST_COLUMNS = `id, title, status, created_at, object_id,
  object:objects(id, name),
  assignee:profiles!tasks_assignee_id_fkey(${PERSON})`;

const DETAIL_COLUMNS = `*,
  object:objects(id, name, address),
  assignee:profiles!tasks_assignee_id_fkey(${PERSON}),
  author:profiles!tasks_author_id_fkey(${PERSON})`;

export const TasksAPI = {
  async listByObject(
    client: DbClient,
    objectId: string,
  ): Promise<IResponse<TaskListItem[]>> {
    try {
      const result = await client
        .from(EndpointResources.tables.tasks)
        .select(LIST_COLUMNS)
        .eq("object_id", objectId)
        .order("created_at", { ascending: false });
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async listByAssignee(
    client: DbClient,
    assigneeId: string,
  ): Promise<IResponse<TaskListItem[]>> {
    try {
      const result = await client
        .from(EndpointResources.tables.tasks)
        .select(LIST_COLUMNS)
        .eq("assignee_id", assigneeId)
        .order("created_at", { ascending: false });
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async getById(
    client: DbClient,
    id: string,
  ): Promise<IResponse<TaskDetail | null>> {
    try {
      const result = await client
        .from(EndpointResources.tables.tasks)
        .select(DETAIL_COLUMNS)
        .eq("id", id)
        .maybeSingle();
      return responseHandler(result);
    } catch (e) {
      return errorHandler(e);
    }
  },

  async create(
    client: DbClient,
    payload: Pick<
      TaskInsert,
      "object_id" | "title" | "description" | "assignee_id"
    >,
  ): Promise<IResponse<Task>> {
    try {
      const result = await client
        .from(EndpointResources.tables.tasks)
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
    payload: Pick<TaskUpdate, "title" | "description" | "assignee_id">,
  ): Promise<IResponse<Task>> {
    try {
      const result = await client
        .from(EndpointResources.tables.tasks)
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
        .from(EndpointResources.tables.tasks)
        .delete()
        .eq("id", id);
      return responseHandler({ data: null, error });
    } catch (e) {
      return errorHandler(e);
    }
  },

  async changeStatus(
    client: DbClient,
    payload: { taskId: string; status: TaskStatus; comment?: string },
  ): Promise<IResponse<null>> {
    try {
      const { error } = await client.rpc(
        EndpointResources.rpc.changeTaskStatus,
        {
          p_task_id: payload.taskId,
          p_status: payload.status,
          p_comment: payload.comment,
        },
      );
      return responseHandler({ data: null, error });
    } catch (e) {
      return errorHandler(e);
    }
  },
};
