"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export const createService = async (formData: FormData) => {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const basePrice = Number(formData.get("base_price") || 0);

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    throw new Error("Unauthorized");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").insert({
    organization_id: organizationId,
    name,
    description: description || null,
    base_price: basePrice,
  });

  if (error) {
    throw new Error(error.message);
  }
};
