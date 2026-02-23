import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deleteQuoteAction,
  generateQuotePdfAction,
  updateQuoteStatusAction,
} from "@/lib/actions/quotes";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { QuoteStatusSelect } from "@/components/quotes/status-select";
import { SendQuoteModal } from "@/components/quotes/send-quote-modal";

type PageProps = {
  params: { id: string };
};

export default async function QuoteDetailPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();
  const organizationId = await getCurrentOrganizationId();
  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, description, total_price, status, created_at, customer_id, pdf_url"
    )
    .eq("id", params.id)
    .eq("organization_id", organizationId ?? "")
    .single();

  const { data: items } = await supabase
    .from("quote_items")
    .select("id, name, description, price")
    .eq("quote_id", params.id);

  const { data: organization } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId ?? "")
    .single();

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("from_name, from_email, signature")
    .eq("organization_id", organizationId ?? "")
    .maybeSingle();

  if (!quote) {
    return <div>Cotizacion no encontrada.</div>;
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("name, email")
    .eq("id", quote.customer_id)
    .eq("organization_id", organizationId ?? "")
    .single();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Cotizacion
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{quote.title}</h1>
        <div className="mt-4 max-w-xs">
          <ActionForm
            action={updateQuoteStatusAction}
            successMessage="Estado actualizado"
          >
            <input type="hidden" name="quote_id" value={quote.id} />
            <QuoteStatusSelect value={quote.status} />
          </ActionForm>
        </div>
      </div>

      <Card className="border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Descripcion</p>
        <p className="mt-2 text-base">{quote.description}</p>
        <div className="mt-6 space-y-3">
          {items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <p className="text-sm font-semibold">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-lg font-semibold">
            ${Number(quote.total_price).toFixed(2)}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionForm
            action={generateQuotePdfAction}
            successMessage="PDF generado"
          >
            <input type="hidden" name="quote_id" value={quote.id} />
            <SubmitButton variant="secondary">Generar PDF</SubmitButton>
          </ActionForm>
          {customer ? (
            <SendQuoteModal
              quoteId={quote.id}
              customerName={customer.name}
              customerEmail={customer.email}
              subject={`Cotizacion: ${quote.title}`}
              html={`
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827;">
                  <p>Hola ${customer.name},</p>
                  <p>Adjuntamos tu cotizacion de ${
                    organization?.name ?? "QuoteAI"
                  }. Si necesitas ajustes, respondeme a este correo.</p>
                  <p>
                    Ver la cotizacion aqui: <a href="${
                      process.env.NEXT_PUBLIC_APP_URL
                    }/q/${quote.id}">Ver cotizacion</a>
                  </p>
                  <p>${emailSettings?.signature ?? ""}</p>
                </div>
              `}
            />
          ) : null}
          <ActionForm
            action={deleteQuoteAction}
            successMessage="Cotizacion eliminada"
          >
            <input type="hidden" name="quote_id" value={quote.id} />
            <SubmitButton
              variant="destructive"
              onClick={(event) => {
                if (!window.confirm("¿Eliminar esta cotizacion?")) {
                  event.preventDefault();
                }
              }}
            >
              Eliminar cotizacion
            </SubmitButton>
          </ActionForm>
          {quote.pdf_url ? (
            <Button asChild variant="ghost">
              <a href={quote.pdf_url} target="_blank" rel="noreferrer">
                Ver PDF
              </a>
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
