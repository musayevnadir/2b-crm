"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type MainNavProps = {
  role: UserRole;
  todoCount: number;
};

export function MainNav({ role, todoCount }: MainNavProps) {
  const pathname = usePathname();
  const from = useSearchParams().get("from");
  const onTask = pathname.startsWith("/tasks/");

  const myTasksActive =
    pathname === ROUTES.myTasks || (onTask && from !== "object");
  const objectsActive =
    pathname.startsWith(ROUTES.objects) ||
    (onTask && (role === "manager" || from === "object"));

  return (
    <nav className="flex items-center gap-1">
      {role === "executor" && (
        <NavItem href={ROUTES.myTasks} active={myTasksActive} count={todoCount}>
          Мои задачи
        </NavItem>
      )}
      <NavItem href={ROUTES.objects} active={objectsActive}>
        Объекты
      </NavItem>
    </nav>
  );
}

function NavItem({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      {!!count && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-semibold text-background">
          {count}
        </span>
      )}
    </Link>
  );
}
