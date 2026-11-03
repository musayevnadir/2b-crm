import Link from "next/link";

import { SearchX } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 p-4 text-center">
      <Logo />
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="text-sm text-muted-foreground">
          Возможно, её удалили или у вас нет к ней доступа
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.home}>На главную</Link>
      </Button>
    </main>
  );
}
