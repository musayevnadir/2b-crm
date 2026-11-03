export const EndpointResources = {
  tables: {
    profiles: "profiles",
    objects: "objects",
    tasks: "tasks",
    taskHistory: "task_history",
  },
  rpc: {
    changeTaskStatus: "change_task_status",
    isManager: "is_manager",
  },
} as const;
