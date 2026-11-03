import { Suspense } from "react";
import Link from "next/link";

import { ROUTES } from "@/config/routes";
import type { Profile } from "@/types";

import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { UserMenu } from "./user-menu";

type AppHeaderProps = {
  profile: Profile;
  todoCount: number;
};

export function AppHeader({ profile, todoCount }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href={ROUTES.home}>
          <Logo withText={false} className="sm:hidden" />
          <Logo className="hidden sm:flex" />
        </Link>
        <Suspense>
          <MainNav role={profile.role} todoCount={todoCount} />
        </Suspense>
        <div className="ml-auto">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
