import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateQuotePdf, sendQuote } from "@/lib/actions/quotes";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

type PageProps = {
  params: { id: string };
};

export default async function QuoteDetailPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
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

  if (!quote) {
    return <div>Quote not found.</div>;
  }

  const generatePdfAction = async () => {
    "use server";
    await generateQuotePdf(quote.id);
  };

  const sendQuoteAction = async () => {
    "use server";
    await sendQuote(quote.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Quote
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{quote.title}</h1>
        <p className="text-sm text-muted-foreground">{quote.status}</p>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <p className="text-sm text-muted-foreground">Description</p>
        <p className="mt-2 text-base">{quote.description}</p>
        <div className="mt-6 space-y-3">
          {items?.map((item) => (
            <div
              key={item.id}
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
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-lg font-semibold">
            ${Number(quote.total_price).toFixed(2)}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={generatePdfAction}>
            <Button type="submit" variant="secondary">
              Generate PDF
            </Button>
          </form>
          <form action={sendQuoteAction}>
            <Button type="submit">Send to customer</Button>
          </form>
          {quote.pdf_url ? (
            <Button asChild variant="ghost">
              <a href={quote.pdf_url} target="_blank" rel="noreferrer">
                View PDF
              </a>
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
