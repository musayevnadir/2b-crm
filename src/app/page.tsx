import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect(ROUTES.login);

  redirect(profile.role === "manager" ? ROUTES.objects : ROUTES.myTasks);
}
