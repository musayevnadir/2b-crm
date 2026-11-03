import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect(ROUTES.login);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/30">
      <AppHeader profile={profile} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-8 pb-12">
        {children}
      </main>
    </div>
  );
}
