"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { ActionResult } from "@/lib/actions/types";

export const createCustomer = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("customers").insert({
    organization_id: organizationId,
    name,
    email,
    company: company || null,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};
