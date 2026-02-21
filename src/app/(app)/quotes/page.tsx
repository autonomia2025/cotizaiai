import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomerSelect } from "@/components/forms/customer-select";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { generateQuoteFromRequest } from "@/lib/actions/quotes";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, title, status, total_price, created_at")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Quotes
        </p>
        <h1 className="mt-2 text-3xl font-semibold">AI-generated quotes</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Create new quote</h2>
        <form
          action={
            generateQuoteFromRequest as unknown as (
              formData: FormData
            ) => Promise<void>
          }
          className="mt-4 grid gap-4"
        >
          <CustomerSelect customers={customers ?? []} />
          <Textarea
            name="request"
            placeholder="Describe what the customer needs"
            rows={4}
            required
          />
          <Button type="submit">Generate quote with AI</Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {quotes?.map((quote) => (
          <Link key={quote.id} href={`/quotes/${quote.id}`}>
            <Card className="flex items-center justify-between border-border/60 bg-white/70 px-6 py-4 transition hover:shadow-lg">
              <div>
                <p className="text-sm font-semibold">{quote.title}</p>
                <p className="text-xs text-muted-foreground">{quote.status}</p>
              </div>
              <p className="text-sm font-semibold">
                ${Number(quote.total_price).toFixed(2)}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
