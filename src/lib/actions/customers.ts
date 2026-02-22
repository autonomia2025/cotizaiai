"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { ActionResult } from "@/lib/actions/types";
import { redirect } from "next/navigation";

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

export const updateCustomer = async (
  id: string,
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
  const { error } = await supabase
    .from("customers")
    .update({
      name,
      email,
      company: company || null,
    })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const deleteCustomer = async (id: string): Promise<ActionResult> => {
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const updateCustomerAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const customerId = String(formData.get("customer_id") || "");
  if (!customerId) {
    return { error: "Missing customer." };
  }
  return updateCustomer(customerId, formData);
};

export const deleteCustomerAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const customerId = String(formData.get("customer_id") || "");
  if (!customerId) {
    return { error: "Missing customer." };
  }
  const result = await deleteCustomer(customerId);
  if (result.error) {
    return result;
  }
  redirect("/customers");
  return { success: true };
};
