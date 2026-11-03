import { ArrowRight } from "lucide-react";

import { formatDateTime, fullName } from "@/lib/format";
import type { TaskHistoryItem } from "@/types";

import { StatusBadge } from "./status-badge";

export function TaskHistory({ items }: { items: TaskHistoryItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">История пока пуста</p>;
  }

  return (
    <ol className="relative space-y-5 border-l pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full border-2 border-background bg-foreground" />
          <div className="flex flex-wrap items-center gap-2">
            {item.from_status ? (
              <>
                <StatusBadge status={item.from_status} />
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Создана —</span>
            )}
            <StatusBadge status={item.to_status} />
          </div>
          <p className="mt-1 text-sm">
            <span className="font-medium">
              {fullName(item.changed_by_profile)}
            </span>
            <span className="text-muted-foreground">
              {" · "}
              {formatDateTime(item.created_at)}
            </span>
          </p>
          {item.comment && (
            <p className="mt-2 rounded-md border bg-muted/40 px-3 py-2 text-sm whitespace-pre-line">
              {item.comment}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
