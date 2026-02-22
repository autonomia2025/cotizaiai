"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActionResult } from "@/lib/actions/types";

export const signUpWithOrganization = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const organization = String(formData.get("organization") || "").trim();

  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    console.error("signUpWithOrganization: auth signUp failed", error);
    const message = error?.message ?? "No se pudo crear la cuenta.";
    if (message.toLowerCase().includes("already registered")) {
      return { error: "Ya existe una cuenta con este email. Inicia sesion." };
    }
    return { error: message };
  }

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: organization })
    .select("id")
    .single();

  if (orgError || !org) {
    console.error("signUpWithOrganization: organization insert failed", orgError);
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: orgError?.message ?? "No se pudo crear la organizacion." };
  }

  const { error: userError } = await admin.from("users").insert({
    id: data.user.id,
    organization_id: org.id,
    email,
    name,
    role: "owner",
  });

  if (userError) {
    console.error("signUpWithOrganization: users insert failed", userError);
    await admin.from("organizations").delete().eq("id", org.id);
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: userError.message };
  }

  if (!data.session) {
    return {
      success: true,
      message: "Cuenta creada. Revisa tu email para confirmar.",
    };
  }

  redirect("/dashboard");
  return { success: true };
};

export const signIn = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("email") && message.includes("not confirmed")) {
      return { error: "Debes confirmar tu email antes de ingresar." };
    }
    if (message.includes("invalid login credentials")) {
      return { error: "Credenciales incorrectas." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
  return { success: true };
};

export const signOut = async (): Promise<ActionResult> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  redirect("/login");
  return { success: true };
};
