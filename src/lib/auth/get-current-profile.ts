import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { AuthAPI } from "@/services/api/auth.api";
import { ProfilesAPI } from "@/services/api/profiles.api";

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const { data: user } = await AuthAPI.getUser(supabase);
  if (!user) return null;

  const { data: profile } = await ProfilesAPI.getById(supabase, user.id);
  return profile;
});
