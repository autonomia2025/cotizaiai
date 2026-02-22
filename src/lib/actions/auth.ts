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
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return { error: error?.message ?? "Unable to sign up." };
  }

  const admin = createSupabaseAdminClient();
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: organization })
    .select("id")
    .single();

  if (orgError || !org) {
    return { error: orgError?.message ?? "Unable to create organization." };
  }

  const { error: userError } = await admin.from("users").insert({
    id: data.user.id,
    organization_id: org.id,
    email,
    name,
    role: "owner",
  });

  if (userError) {
    return { error: userError.message };
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
