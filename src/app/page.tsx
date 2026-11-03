import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AuthAPI } from "@/services/api/auth.api";
import { ProfilesAPI } from "@/services/api/profiles.api";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: user } = await AuthAPI.getUser(supabase);

  if (!user) redirect("/login");

  const { data: profile } = await ProfilesAPI.getById(supabase, user.id);

  redirect(profile?.role === "manager" ? "/objects" : "/my-tasks");
}
