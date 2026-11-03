import Link from "next/link";

import { ROUTES } from "@/config/routes";
import type { Profile } from "@/types";

import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";

export function AppHeader({ profile }: { profile: Profile }) {
  const isManager = profile.role === "manager";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href={ROUTES.home}>
          <Logo withText={false} className="sm:hidden" />
          <Logo className="hidden sm:flex" />
        </Link>
        <nav className="flex items-center gap-1">
          {!isManager && <NavLink href={ROUTES.myTasks}>Мои задачи</NavLink>}
          <NavLink href={ROUTES.objects}>Объекты</NavLink>
        </nav>
        <div className="ml-auto">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
