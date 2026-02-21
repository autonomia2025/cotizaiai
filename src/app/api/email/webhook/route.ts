import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateEmailReply } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("resend-signature");

  if (!verifyResendSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const supabase = createSupabaseAdminClient();

  const from = payload.from || payload.sender?.email || payload.envelope?.from;
  const subject = payload.subject || payload.headers?.subject || "Inbound reply";
  const content = payload.text || payload.html || payload.body || "";
  const threadHeader = payload.headers?.["x-quoteai-thread-id"];
  const toAddress =
    payload.to ||
    payload.recipient ||
    payload.envelope?.to ||
    payload.headers?.to;
  const normalizedTo = Array.isArray(toAddress) ? toAddress[0] : toAddress;

  if (!from) {
    return NextResponse.json({ ok: false, error: "Missing sender" }, { status: 400 });
  }

  if (!normalizedTo) {
    return NextResponse.json({ ok: false, error: "Missing recipient" }, { status: 400 });
  }

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("organization_id, from_email, reply_to")
    .or(`from_email.eq.${normalizedTo},reply_to.eq.${normalizedTo}`)
    .maybeSingle();

  const organizationId = emailSettings?.organization_id;
  if (!organizationId) {
    return NextResponse.json({ ok: false, error: "Unknown organization" }, { status: 400 });
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id, organization_id, name, email, company")
    .eq("email", from)
    .eq("organization_id", organizationId)
    .single();

  if (!customer) {
    return NextResponse.json({ ok: true });
  }

  let threadId = threadHeader as string | null;
  if (!threadId) {
    const { data: existingThread } = await supabase
      .from("email_threads")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    threadId = existingThread?.id ?? null;
  }

  if (!threadId) {
    const { data: newThread } = await supabase
      .from("email_threads")
      .insert({
        organization_id: organizationId,
        customer_id: customer.id,
        subject,
        status: "open",
      })
      .select("id")
      .single();

    threadId = newThread?.id ?? null;
  }

  if (!threadId) {
    return NextResponse.json({ ok: false, error: "Thread missing" }, { status: 400 });
  }

  const { data: thread } = await supabase
    .from("email_threads")
    .select("id, quote_id, organization_id")
    .eq("id", threadId)
    .eq("organization_id", organizationId)
    .single();

  if (!thread) {
    return NextResponse.json({ ok: false, error: "Thread missing" }, { status: 400 });
  }

  await supabase.from("email_messages").insert({
    thread_id: thread.id,
    direction: "inbound",
    content,
  });

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, logo_url")
    .eq("id", organizationId)
    .single();

  const { data: quote } = thread?.quote_id
    ? await supabase
        .from("quotes")
        .select("id, title, description, total_price")
        .eq("id", thread.quote_id)
        .eq("organization_id", organizationId)
        .single()
    : { data: null };

  const { data: history } = await supabase
    .from("email_messages")
    .select("direction, content, created_at, email_threads!inner(organization_id)")
    .eq("thread_id", threadId)
    .eq("email_threads.organization_id", organizationId)
    .order("created_at", { ascending: true })
    .limit(12);

  if (organization && history) {
    const quotePublicUrl = quote?.id
      ? `${process.env.NEXT_PUBLIC_APP_URL}/q/${quote.id}`
      : null;
    const aiReply = await generateEmailReply({
      organization,
      customer,
      quote,
      emailHistory: history,
      quotePublicUrl,
    });

    await supabase.from("email_messages").insert({
      thread_id: threadId,
      direction: "outbound",
      content: aiReply.body,
      is_suggested: true,
    });
  }

  return NextResponse.json({ ok: true });
}

const verifyResendSignature = (payload: string, signature: string | null) => {
  if (!signature || !process.env.RESEND_WEBHOOK_SECRET) {
    return false;
  }

  const timestampMatch = signature.match(/t=([^,]+)/);
  const signatureMatch = signature.match(/v1=([^,]+)/);
  const timestamp = timestampMatch?.[1];
  const provided = signatureMatch?.[1];

  if (!timestamp || !provided) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", process.env.RESEND_WEBHOOK_SECRET)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(provided, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
};
