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
    return { error: "No autorizado" };
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

export const updateService = async (
  id: string,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const basePrice = Number(formData.get("base_price") || 0);

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "No autorizado" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .update({
      name,
      description: description || null,
      base_price: basePrice,
    })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const deleteService = async (id: string): Promise<ActionResult> => {
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "No autorizado" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
};

export const updateServiceAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const serviceId = String(formData.get("service_id") || "");
  if (!serviceId) {
    return { error: "Falta el servicio." };
  }
  return updateService(serviceId, formData);
};

export const deleteServiceAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const serviceId = String(formData.get("service_id") || "");
  if (!serviceId) {
    return { error: "Falta el servicio." };
  }
  return deleteService(serviceId);
};
