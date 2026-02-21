"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export const createCustomer = async (formData: FormData) => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    throw new Error("Unauthorized");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("customers").insert({
    organization_id: organizationId,
    name,
    email,
    company: company || null,
  });

  if (error) {
    throw new Error(error.message);
  }
};
