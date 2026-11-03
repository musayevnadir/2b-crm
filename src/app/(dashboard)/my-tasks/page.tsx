import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ClipboardCheck } from "lucide-react";

import { FormError } from "@/components/form";
import { EmptyState } from "@/components/layout/empty-state";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { TasksTable } from "@/modules/tasks";
import { TasksAPI } from "@/services/api/tasks.api";

export const metadata: Metadata = { title: "Мои задачи · Объекты и задачи" };

export default async function MyTasksPage() {
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);
  if (!profile) redirect(ROUTES.login);
  if (profile.role === "manager") redirect(ROUTES.objects);

  const response = await TasksAPI.listByAssignee(supabase, profile.id);

  return (
    <Page>
      <PageHeader title="Мои задачи" description="Задачи, назначенные вам" />
      {!response.result ? (
        <FormError message="Не удалось загрузить задачи" />
      ) : response.data.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Задач пока нет"
          description="Когда постановщик назначит вам задачу, она появится здесь"
        />
      ) : (
        <TasksTable tasks={response.data} show="object" />
      )}
    </Page>
  );
}
