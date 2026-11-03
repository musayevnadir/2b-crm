import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { ROUTES } from "@/config/routes";
import { EXECUTOR_TODO_STATUSES } from "@/config/task-groups";
import { createClient } from "@/lib/supabase/server";
import { TasksAPI } from "@/services/api/tasks.api";
import { getCurrentProfile } from "@/services/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect(ROUTES.login);

  const todo =
    profile.role === "executor"
      ? await TasksAPI.countByAssigneeAndStatuses(
          await createClient(),
          profile.id,
          EXECUTOR_TODO_STATUSES,
        )
      : null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/30">
      <AppHeader profile={profile} todoCount={todo?.data ?? 0} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-8 pb-12">
        {children}
      </main>
    </div>
  );
}
