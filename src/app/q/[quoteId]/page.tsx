import { Card } from "@/components/ui/card";
import { QuoteResponseButtons } from "@/components/quotes/quote-response-buttons";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: { quoteId: string };
};

export default async function PublicQuoteByIdPage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, description, total_price, created_at, status, pdf_url, customer_id, organization_id"
    )
    .eq("id", params.quoteId)
    .single();

  if (!quote) {
    return (
      <div className="min-h-screen px-6 py-16">
        <div className="mx-auto w-full max-w-[700px] rounded-3xl border border-dashed border-border/60 bg-white/70 px-8 py-14 text-center shadow-xl shadow-muted/30">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            QuoteAI
          </p>
          <h1 className="mt-4 text-2xl font-semibold">Quote not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The quote link might be expired or incorrect. Please request a new
            one from the sender.
          </p>
        </div>
      </div>
    );
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, logo_url")
    .eq("id", quote.organization_id)
    .single();

  const { data: customer } = await supabase
    .from("customers")
    .select("name, company, organization_id")
    .eq("id", quote.customer_id)
    .eq("organization_id", quote.organization_id)
    .single();

  const { data: items } = await supabase
    .from("quote_items")
    .select("name, description, price")
    .eq("quote_id", quote.id);

  return (
    <div className="min-h-screen px-6 py-14">
      <div className="mx-auto w-full max-w-[700px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {organization?.name ?? "QuoteAI"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold">{quote.title}</h1>
          </div>
          {organization?.logo_url ? (
            <img
              src={organization.logo_url}
              alt={`${organization.name} logo`}
              className="h-12 w-auto object-contain"
            />
          ) : null}
        </div>

        <Card className="border-border/60 bg-white/80 p-8 shadow-xl shadow-muted/40">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Prepared for
              </p>
              <p className="mt-2 text-lg font-semibold">
                {customer?.name ?? "Customer"}
              </p>
              {customer?.company ? (
                <p className="text-sm text-muted-foreground">
                  {customer.company}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${Number(quote.total_price).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Description
            </p>
            <p className="mt-3 text-base text-foreground">
              {quote.description}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {items?.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3"
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

          <QuoteResponseButtons quoteId={quote.id} status={quote.status} />

          {quote.pdf_url ? (
            <a
              href={quote.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline"
            >
              Download PDF
            </a>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
