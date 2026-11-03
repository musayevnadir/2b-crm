import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ClipboardCheck, PartyPopper } from "lucide-react";

import { FormError } from "@/components/form";
import { EmptyState } from "@/components/layout/empty-state";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { ROUTES } from "@/config/routes";
import { isExecutorTodo } from "@/config/task-groups";
import { createClient } from "@/lib/supabase/server";
import { TasksTable } from "@/modules/tasks";
import { TasksAPI } from "@/services/api/tasks.api";
import { getCurrentProfile } from "@/services/session";

export const metadata: Metadata = { title: "Мои задачи · Объекты и задачи" };

export default async function MyTasksPage() {
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);
  if (!profile) redirect(ROUTES.login);
  if (profile.role === "manager") redirect(ROUTES.objects);

  const response = await TasksAPI.listByAssignee(supabase, profile.id);
  const tasks = response.data ?? [];
  const todo = tasks.filter((task) => isExecutorTodo(task.status));
  const waiting = tasks.filter((task) => !isExecutorTodo(task.status));

  return (
    <Page>
      <PageHeader title="Мои задачи" description="Задачи, назначенные вам" />
      {!response.result ? (
        <FormError message="Не удалось загрузить задачи" />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Задач пока нет"
          description="Когда постановщик назначит вам задачу, она появится здесь"
        />
      ) : (
        <>
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Нужно сделать</h2>
              <p className="text-sm text-muted-foreground">
                Новые, в работе и возвращённые на доработку
              </p>
            </div>
            {todo.length > 0 ? (
              <TasksTable tasks={todo} show="object" from="my-tasks" />
            ) : (
              <EmptyState
                icon={PartyPopper}
                title="Всё сделано"
                description="Новых задач и доработок нет"
              />
            )}
          </section>
          {waiting.length > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">
                  На проверке и завершённые
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ждут решения постановщика или уже приняты
                </p>
              </div>
              <TasksTable tasks={waiting} show="object" from="my-tasks" />
            </section>
          )}
        </>
      )}
    </Page>
  );
}
