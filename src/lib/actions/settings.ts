"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { ActionResult } from "@/lib/actions/types";

export const updateOrganization = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoUrl = String(formData.get("logo_url") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      name,
      description: description || null,
      logo_url: logoUrl || null,
    })
    .eq("id", organizationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const updateEmailSettings = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const fromName = String(formData.get("from_name") || "").trim();
  const fromEmail = String(formData.get("from_email") || "").trim();
  const replyTo = String(formData.get("reply_to") || "").trim();
  const signature = String(formData.get("signature") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("email_settings")
    .select("id")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("email_settings")
      .update({
        from_name: fromName || null,
        from_email: fromEmail || null,
        reply_to: replyTo || null,
        signature: signature || null,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
    return { success: true };
  }

  const { error } = await supabase.from("email_settings").insert({
    organization_id: organizationId,
    from_name: fromName || null,
    from_email: fromEmail || null,
    reply_to: replyTo || null,
    signature: signature || null,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};
