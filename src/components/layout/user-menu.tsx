"use client";

import { useRouter } from "next/navigation";

import { ChevronDown, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/config/labels";
import { ROUTES } from "@/config/routes";
import { fullName, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { AuthAPI } from "@/services/api/auth.api";
import type { Profile } from "@/types";

export function UserMenu({ profile }: { profile: Profile }) {
  const router = useRouter();

  async function handleLogout() {
    await AuthAPI.signOut(createClient());
    router.replace(ROUTES.login);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-3 px-2 py-1.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
            {initials(profile)}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium">
              {fullName(profile)}
            </span>
            <span className="block text-xs text-muted-foreground">
              {ROLE_LABELS[profile.role]}
            </span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium text-foreground">
            {fullName(profile)}
          </span>
          <span className="block text-xs text-muted-foreground">
            {profile.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
