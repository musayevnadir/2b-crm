import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { formatDateTime, fullName } from "@/lib/format";
import type { TaskDetail } from "@/types";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export function TaskDetails({ task }: { task: TaskDetail }) {
  return (
    <dl className="space-y-3">
      <Row label="Объект">
        {task.object ? (
          <Link
            href={ROUTES.object(task.object.id)}
            className="font-medium underline-offset-4 hover:underline"
          >
            {task.object.name}
          </Link>
        ) : (
          "—"
        )}
      </Row>
      <Row label="Исполнитель">{fullName(task.assignee)}</Row>
      <Row label="Автор">{fullName(task.author)}</Row>
      <Row label="Создана">{formatDateTime(task.created_at)}</Row>
      <Row label="Описание">
        {task.description ? (
          <span className="whitespace-pre-line">{task.description}</span>
        ) : (
          <span className="text-muted-foreground">Без описания</span>
        )}
      </Row>
    </dl>
  );
}
