"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { ActionResult } from "@/lib/actions/types";

export const createService = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const basePrice = Number(formData.get("base_price") || 0);

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").insert({
    organization_id: organizationId,
    name,
    description: description || null,
    base_price: basePrice,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};
