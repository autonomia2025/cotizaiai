"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { ActionResult } from "@/lib/actions/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendQuoteEmail } from "@/lib/email/resend";
import { redirect } from "next/navigation";

export const updateOrganization = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoUrl = String(formData.get("logo_url") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "No autorizado" };
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
    return { error: "No autorizado" };
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

export const inviteMember = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "member").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    return { error: "No autorizado" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  if (profile?.role !== "owner") {
    return { error: "Solo propietarios pueden invitar miembros." };
  }

  const { data: invite, error } = await supabase
    .from("invitations")
    .insert({
      organization_id: organizationId,
      email,
      role: role || "member",
    })
    .select("token")
    .single();

  if (error || !invite) {
    return { error: error?.message ?? "No se pudo crear la invitacion." };
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .single();

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("from_name, from_email")
    .eq("organization_id", organizationId)
    .maybeSingle();

  const fromName = emailSettings?.from_name ?? organization?.name ?? "QuoteAI";
  const fromEmail = emailSettings?.from_email ?? "quotes@quoteai.app";
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
      <p>Has sido invitado a unirte a ${organization?.name ?? "QuoteAI"}.</p>
      <p><a href="${inviteUrl}">Aceptar invitacion</a></p>
    </div>
  `;

  await sendQuoteEmail({
    to: email,
    from: `${fromName} <${fromEmail}>`,
    subject: `Invitacion a ${organization?.name ?? "QuoteAI"}`,
    html,
  });

  return { success: true };
};

export const acceptInvitation = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const token = String(formData.get("token") || "");
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");

  if (!token || !name || !password) {
    return { error: "Faltan campos requeridos" };
  }

  const admin = createSupabaseAdminClient();
  const { data: invitation } = await admin
    .from("invitations")
    .select("id, email, organization_id, role, accepted_at")
    .eq("token", token)
    .single();

  if (!invitation || invitation.accepted_at) {
    return { error: "La invitacion es invalida o ya fue aceptada." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: invitation.email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "No se pudo crear la cuenta." };
  }

  const { error: userError } = await admin.from("users").insert({
    id: data.user.id,
    organization_id: invitation.organization_id,
    email: invitation.email,
    name,
    role: invitation.role ?? "member",
  });

  if (userError) {
    return { error: userError.message };
  }

  await admin
    .from("invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  if (!data.session) {
    return {
      success: true,
      message: "Cuenta creada. Revisa tu email para confirmar.",
    };
  }

  redirect("/dashboard");
  return { success: true };
};
