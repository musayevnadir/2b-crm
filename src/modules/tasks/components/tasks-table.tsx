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
import { ROUTES, type TaskFrom } from "@/config/routes";
import { formatDate, fullName } from "@/lib/format";
import type { TaskListItem } from "@/types";

import { StatusBadge } from "./status-badge";

type TasksTableProps = {
  tasks: TaskListItem[];
  show: "assignee" | "object" | "none";
  from: TaskFrom;
};

export function TasksTable({ tasks, show, from }: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Задача</TableHead>
            <TableHead className="w-36">Статус</TableHead>
            {show !== "none" && (
              <TableHead className="hidden w-60 md:table-cell">
                {show === "assignee" ? "Исполнитель" : "Объект"}
              </TableHead>
            )}
            <TableHead className="hidden w-32 sm:table-cell">Создана</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group relative">
              <TableCell className="truncate font-medium">
                <Link
                  href={ROUTES.task(task.id, from)}
                  className="after:absolute after:inset-0"
                >
                  {task.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              {show !== "none" && (
                <TableCell className="hidden truncate text-muted-foreground md:table-cell">
                  {show === "assignee"
                    ? fullName(task.assignee)
                    : (task.object?.name ?? "—")}
                </TableCell>
              )}
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDate(task.created_at)}
              </TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
