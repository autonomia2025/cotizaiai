"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signUpWithOrganization = async (formData: FormData) => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const organization = String(formData.get("organization") || "").trim();

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Unable to sign up.");
  }

  const admin = createSupabaseAdminClient();
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: organization })
    .select("id")
    .single();

  if (orgError || !org) {
    throw new Error(orgError?.message ?? "Unable to create organization.");
  }

  const { error: userError } = await admin.from("users").insert({
    id: data.user.id,
    organization_id: org.id,
    email,
    name,
    role: "owner",
  });

  if (userError) {
    throw new Error(userError.message);
  }

  redirect("/dashboard");
};

export const signIn = async (formData: FormData) => {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
};

export const signOut = async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
};
