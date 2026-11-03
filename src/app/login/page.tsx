import type { Metadata } from "next";

import { Logo } from "@/components/layout/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Вход · Объекты и задачи",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/40 p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>
              Войдите под учётной записью, выданной администратором
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
