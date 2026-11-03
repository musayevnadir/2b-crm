import { notFound } from "next/navigation";

import { BackLink } from "@/components/layout/back-link";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { createClient } from "@/lib/supabase/server";
import {
  StatusBadge,
  TaskDetails,
  TaskHistory,
  TaskManageActions,
  TaskStatusActions,
} from "@/modules/tasks";
import { ProfilesAPI } from "@/services/api/profiles.api";
import { TaskHistoryAPI } from "@/services/api/task-history.api";
import { TasksAPI } from "@/services/api/tasks.api";
import { getCurrentProfile } from "@/services/session";

export default async function TaskPage({ params }: PageProps<"/tasks/[id]">) {
  const { id } = await params;
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);
  const isManager = profile?.role === "manager";

  const [taskResponse, historyResponse, executorsResponse] = await Promise.all([
    TasksAPI.getById(supabase, id),
    TaskHistoryAPI.listByTask(supabase, id),
    isManager ? ProfilesAPI.listExecutors(supabase) : null,
  ]);

  const task = taskResponse.data;
  if (!task) notFound();

  const isAssignee = task.assignee_id === profile?.id;

  return (
    <Page>
      <BackLink
        href={isManager ? ROUTES.object(task.object_id) : ROUTES.myTasks}
      >
        {isManager ? (task.object?.name ?? "К объекту") : "Мои задачи"}
      </BackLink>

      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {task.title}
            <StatusBadge status={task.status} />
          </span>
        }
        action={
          isManager && (
            <TaskManageActions
              task={task}
              executors={executorsResponse?.data ?? []}
            />
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskStatusActions
                taskId={task.id}
                status={task.status}
                isManager={isManager}
                isAssignee={isAssignee}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskDetails task={task} />
            </CardContent>
          </Card>
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>История</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskHistory items={historyResponse.data ?? []} />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
