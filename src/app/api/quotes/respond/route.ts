import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendQuoteEmail } from "@/lib/email/resend";

type RespondPayload = {
  quoteId: string;
  action: "accepted" | "rejected";
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RespondPayload;
  const quoteId = String(payload.quoteId || "");
  const action = payload.action;

  if (!quoteId || (action !== "accepted" && action !== "rejected")) {
    return NextResponse.json(
      { success: false, error: "Solicitud invalida" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status, organization_id, customer_id, title")
    .eq("id", quoteId)
    .single();

  if (!quote) {
    return NextResponse.json(
      { success: false, error: "Cotizacion no encontrada" },
      { status: 404 }
    );
  }

  if (quote.status !== "sent") {
    return NextResponse.json(
      { success: false, error: "Cotizacion ya respondida" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("quotes")
    .update({ status: action })
    .eq("id", quoteId);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", quote.organization_id)
    .single();

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("from_name, from_email")
    .eq("organization_id", quote.organization_id)
    .maybeSingle();

  const { data: customer } = await supabase
    .from("customers")
    .select("name, email")
    .eq("id", quote.customer_id)
    .single();

  const toEmail = emailSettings?.from_email;
  if (toEmail) {
    const orgName = emailSettings?.from_name ?? organization?.name ?? "QuoteAI";
    const actionLabel = action === "accepted" ? "aceptada" : "rechazada";
    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
        <p>${customer?.name ?? "Un cliente"} ha ${
          action === "accepted" ? "aceptado" : "rechazado"
        } la cotizacion.</p>
        <p><strong>Cotizacion:</strong> ${quote.title}</p>
        <p><strong>Estado:</strong> ${actionLabel}</p>
      </div>
    `;

    await sendQuoteEmail({
      to: toEmail,
      from: `${orgName} <${toEmail}>`,
      subject: `Cotizacion ${actionLabel}: ${quote.title}`,
      html,
    });
  }

  return NextResponse.json({ success: true });
}
