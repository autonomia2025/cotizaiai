"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { sendQuoteEmail } from "@/lib/email/resend";

export const sendThreadReply = async (formData: FormData) => {
  const threadId = String(formData.get("thread_id") || "");
  const body = String(formData.get("body") || "").trim();

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) {
    throw new Error("Unauthorized");
  }

  const supabase = createSupabaseServerClient();
  const { data: thread } = await supabase
    .from("email_threads")
    .select("id, subject, customer_id")
    .eq("id", threadId)
    .eq("organization_id", organizationId)
    .single();

  if (!thread) {
    throw new Error("Thread not found.");
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .single();

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("from_name, from_email, reply_to, signature")
    .eq("organization_id", organizationId)
    .maybeSingle();

  const { data: customer } = await supabase
    .from("customers")
    .select("name, email")
    .eq("id", thread.customer_id)
    .eq("organization_id", organizationId)
    .single();

  if (!organization || !customer) {
    throw new Error("Missing email data.");
  }

  const fromName = emailSettings?.from_name ?? organization.name;
  const fromEmail = emailSettings?.from_email ?? "quotes@quoteai.app";

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
      <p>Hi ${customer.name},</p>
      <p>${body.replace(/\n/g, "<br />")}</p>
      <p>${emailSettings?.signature ?? ""}</p>
    </div>
  `;

  await sendQuoteEmail({
    to: customer.email,
    from: `${fromName} <${fromEmail}>`,
    subject: thread.subject ?? "QuoteAI Reply",
    html,
    replyTo: emailSettings?.reply_to ?? fromEmail,
    headers: { "X-QuoteAI-Thread-Id": thread.id },
  });

  await supabase.from("email_messages").insert({
    thread_id: thread.id,
    direction: "outbound",
    content: body,
    is_suggested: false,
  });
};
