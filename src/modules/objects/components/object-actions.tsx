"use client";

import { useRouter } from "next/navigation";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { createClient } from "@/lib/supabase/client";
import { ObjectsAPI } from "@/services/api/objects.api";
import type { ObjectRow } from "@/types";

import { ObjectFormDialog } from "./object-form-dialog";

export function ObjectActions({ object }: { object: ObjectRow }) {
  const router = useRouter();

  async function handleDelete() {
    const response = await ObjectsAPI.remove(createClient(), object.id);
    if (!response.result) {
      toast.error("Не удалось удалить объект");
      return false;
    }
    toast.success("Объект удалён");
    router.replace(ROUTES.objects);
    router.refresh();
    return true;
  }

  return (
    <div className="flex gap-2">
      <ObjectFormDialog
        object={object}
        trigger={
          <Button variant="outline">
            <Pencil className="size-4" />
            Изменить
          </Button>
        }
      />
      <ConfirmDialog
        trigger={
          <Button variant="outline" className="text-destructive">
            <Trash2 className="size-4" />
            Удалить
          </Button>
        }
        title="Удалить объект?"
        description={`«${object.name}» будет удалён вместе со всеми задачами и их историей. Это действие нельзя отменить.`}
        confirmText="Удалить"
        onConfirm={handleDelete}
      />
    </div>
  );
}
