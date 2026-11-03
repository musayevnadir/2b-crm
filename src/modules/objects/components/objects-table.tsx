import Link from "next/link";

import { ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/format";
import type { ObjectRow } from "@/types";

import { DeleteObjectButton } from "./delete-object-button";

type ObjectsTableProps = {
  objects: ObjectRow[];
  canDelete: boolean;
};

export function ObjectsTable({ objects, canDelete }: ObjectsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead className="hidden sm:table-cell">Создан</TableHead>
            <TableHead className={canDelete ? "w-24" : "w-10"} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {objects.map((object) => (
            <TableRow key={object.id} className="group relative">
              <TableCell className="font-medium">
                <Link
                  href={ROUTES.object(object.id)}
                  className="after:absolute after:inset-0"
                >
                  {object.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {object.address}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDate(object.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {canDelete && (
                    <DeleteObjectButton object={object} variant="icon" />
                  )}
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
