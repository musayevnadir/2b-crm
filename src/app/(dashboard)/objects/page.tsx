import type { Metadata } from "next";

import { Building2 } from "lucide-react";

import { FormError } from "@/components/form";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ObjectsTable } from "@/modules/objects";
import { ObjectsAPI } from "@/services/api/objects.api";

export const metadata: Metadata = { title: "Объекты · Объекты и задачи" };

export default async function ObjectsPage() {
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);
  const response = await ObjectsAPI.list(supabase);
  const isManager = profile?.role === "manager";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Объекты"
        description={
          isManager
            ? "Все стройки компании"
            : "Стройки, на которых у вас есть задачи"
        }
      />
      {!response.result ? (
        <FormError message="Не удалось загрузить объекты" />
      ) : response.data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Объектов пока нет"
          description={
            isManager ? "Создайте первый объект" : "Вам ещё не назначили задачи"
          }
        />
      ) : (
        <ObjectsTable objects={response.data} />
      )}
    </div>
  );
}
