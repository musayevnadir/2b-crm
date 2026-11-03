import { notFound } from "next/navigation";

import { ClipboardList, MapPin } from "lucide-react";

import { FormError } from "@/components/form";
import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ObjectActions } from "@/modules/objects";
import { TasksTable } from "@/modules/tasks";
import { ObjectsAPI } from "@/services/api/objects.api";
import { TasksAPI } from "@/services/api/tasks.api";

export default async function ObjectPage({
  params,
}: PageProps<"/objects/[id]">) {
  const { id } = await params;
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);

  const [objectResponse, tasksResponse] = await Promise.all([
    ObjectsAPI.getById(supabase, id),
    TasksAPI.listByObject(supabase, id),
  ]);

  const object = objectResponse.data;
  if (!object) notFound();

  const isManager = profile?.role === "manager";
  const tasks = tasksResponse.data ?? [];

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
        <h2 className="text-lg font-semibold">Задачи</h2>
        {!tasksResponse.result ? (
          <FormError message="Не удалось загрузить задачи" />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Задач пока нет"
            description={
              isManager ? "Создайте первую задачу по этому объекту" : undefined
            }
          />
        ) : (
          <TasksTable tasks={tasks} show="assignee" />
        )}
      </section>
    </Page>
  );
}
