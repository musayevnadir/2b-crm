import type { Metadata } from "next";

import { Building2, Plus } from "lucide-react";

import { FormError } from "@/components/form";
import { EmptyState } from "@/components/layout/empty-state";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ObjectFormDialog, ObjectsTable } from "@/modules/objects";
import { ObjectsAPI } from "@/services/api/objects.api";
import { getCurrentProfile } from "@/services/session";

export const metadata: Metadata = { title: "Объекты · Объекты и задачи" };

export default async function ObjectsPage() {
  const [profile, supabase] = await Promise.all([
    getCurrentProfile(),
    createClient(),
  ]);
  const response = await ObjectsAPI.list(supabase);
  const isManager = profile?.role === "manager";

  const createButton = isManager && (
    <ObjectFormDialog
      trigger={
        <Button>
          <Plus className="size-4" />
          Новый объект
        </Button>
      }
    />
  );

  return (
    <Page>
      <PageHeader
        title="Объекты"
        description={
          isManager
            ? "Все стройки компании"
            : "Стройки, на которых у вас есть задачи"
        }
        action={createButton}
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
        <ObjectsTable objects={response.data} canDelete={isManager} />
      )}
    </Page>
  );
}
