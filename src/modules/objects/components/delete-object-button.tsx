"use client";

import { usePathname, useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { createClient } from "@/lib/supabase/client";
import { ObjectsAPI } from "@/services/api/objects.api";
import type { ObjectRow } from "@/types";

type DeleteObjectButtonProps = {
  object: Pick<ObjectRow, "id" | "name">;
  variant: "icon" | "full";
};

export function DeleteObjectButton({
  object,
  variant,
}: DeleteObjectButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleDelete() {
    const response = await ObjectsAPI.remove(createClient(), object.id);
    if (!response.result) {
      toast.error("Не удалось удалить объект");
      return false;
    }
    toast.success("Объект удалён");
    if (pathname !== ROUTES.objects) router.replace(ROUTES.objects);
    router.refresh();
    return true;
  }

  const trigger =
    variant === "icon" ? (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Удалить «${object.name}»`}
        className="relative z-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    ) : (
      <Button variant="outline" className="text-destructive">
        <Trash2 className="size-4" />
        Удалить
      </Button>
    );

  return (
    <ConfirmDialog
      trigger={trigger}
      title="Удалить объект?"
      description={`«${object.name}» будет удалён вместе со всеми задачами и их историей. Это действие нельзя отменить.`}
      confirmText="Удалить"
      onConfirm={handleDelete}
    />
  );
}
