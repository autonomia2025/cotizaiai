import { createSupabaseAdminClient } from "./admin";
import { createSupabaseServerClient } from "./server";

export const getUserContext = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null, organizationId: null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, organization_id, name, role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const admin = createSupabaseAdminClient();
    const { data: adminProfile } = await admin
      .from("users")
      .select("id, organization_id, name, role, email")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfile) {
      return {
        user,
        profile: adminProfile,
        organizationId: adminProfile.organization_id ?? null,
        missingProfile: false,
      };
    }

    return {
      user: null,
      profile: null,
      organizationId: null,
      missingProfile: true,
    };
  }

  return {
    user,
    profile,
    organizationId: profile?.organization_id ?? null,
    missingProfile: false,
  };
};

export const getCurrentOrganizationId = async () => {
  const { organizationId } = await getUserContext();
  return organizationId;
};
