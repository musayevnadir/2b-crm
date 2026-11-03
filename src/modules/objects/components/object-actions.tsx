"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ObjectRow } from "@/types";

import { DeleteObjectButton } from "./delete-object-button";
import { ObjectFormDialog } from "./object-form-dialog";

export function ObjectActions({ object }: { object: ObjectRow }) {
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
      <DeleteObjectButton object={object} variant="full" />
    </div>
  );
}
