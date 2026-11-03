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
import { formatDate, fullName } from "@/lib/format";
import type { TaskListItem } from "@/types";

import { StatusBadge } from "./status-badge";

type TasksTableProps = {
  tasks: TaskListItem[];
  show: "assignee" | "object";
};

export function TasksTable({ tasks, show }: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Задача</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="hidden md:table-cell">
              {show === "assignee" ? "Исполнитель" : "Объект"}
            </TableHead>
            <TableHead className="hidden sm:table-cell">Создана</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group relative">
              <TableCell className="font-medium">
                <Link
                  href={ROUTES.task(task.id)}
                  className="after:absolute after:inset-0"
                >
                  {task.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {show === "assignee"
                  ? fullName(task.assignee)
                  : (task.object?.name ?? "—")}
              </TableCell>
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
