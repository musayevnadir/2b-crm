import { notFound } from "next/navigation";

import { ClipboardList, MapPin, Plus } from "lucide-react";

import { FormError } from "@/components/form";
import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { createClient } from "@/lib/supabase/server";
import { ObjectActions } from "@/modules/objects";
import { TaskFormDialog, TasksTable } from "@/modules/tasks";
import { ObjectsAPI } from "@/services/api/objects.api";
import { ProfilesAPI } from "@/services/api/profiles.api";
import { TasksAPI } from "@/services/api/tasks.api";
import { getCurrentProfile } from "@/services/session";

export default async function ObjectPage({
  params,
}: PageProps<"/objects/[id]">) {
  const { id } = await params;
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);

  const isManager = profile?.role === "manager";

  const [objectResponse, tasksResponse, executorsResponse] = await Promise.all([
    ObjectsAPI.getById(supabase, id),
    TasksAPI.listByObject(supabase, id),
    isManager ? ProfilesAPI.listExecutors(supabase) : null,
  ]);

  const object = objectResponse.data;
  if (!object) notFound();

  const tasks = tasksResponse.data ?? [];

  const createTaskButton = isManager && (
    <TaskFormDialog
      objectId={object.id}
      executors={executorsResponse?.data ?? []}
      trigger={
        <Button>
          <Plus className="size-4" />
          Новая задача
        </Button>
      }
    />
  );

  return (
    <Page>
      <BackLink href={ROUTES.objects}>Все объекты</BackLink>
      <PageHeader
        title={object.name}
        description={
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {object.address}
          </span>
        }
        action={isManager && <ObjectActions object={object} />}
      />
      <section className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Задачи</h2>
          {tasks.length > 0 && createTaskButton}
        </div>
        {!tasksResponse.result ? (
          <FormError message="Не удалось загрузить задачи" />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Задач пока нет"
            description={
              isManager ? "Создайте первую задачу по этому объекту" : undefined
            }
            action={createTaskButton}
          />
        ) : (
          <TasksTable tasks={tasks} show="assignee" />
        )}
      </section>
    </Page>
  );
}
