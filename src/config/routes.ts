export type TaskFrom = "object" | "my-tasks";

export const ROUTES = {
  home: "/",
  login: "/login",
  objects: "/objects",
  object: (id: string) => `/objects/${id}`,
  task: (id: string, from?: TaskFrom) =>
    from ? `/tasks/${id}?from=${from}` : `/tasks/${id}`,
  myTasks: "/my-tasks",
} as const;
