import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

type PageProps = {
  params: { id: string };
};

export default async function CustomerDetailPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
  const organizationId = await getCurrentOrganizationId();
  const { data: customer } = await supabase
    .from("customers")
    .select("id, name, email, company, created_at")
    .eq("id", params.id)
    .eq("organization_id", organizationId ?? "")
    .single();

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, title, status, total_price, created_at")
    .eq("customer_id", params.id)
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!customer) {
    return <div>Customer not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Customer
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{customer.name}</h1>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
        {customer.company ? (
          <p className="text-sm text-muted-foreground">{customer.company}</p>
        ) : null}
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Recent quotes</h2>
        <div className="mt-4 space-y-3">
          {quotes?.map((quote) => (
            <div
              key={quote.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{quote.title}</p>
                <p className="text-xs text-muted-foreground">{quote.status}</p>
              </div>
              <p className="text-sm font-semibold">
                ${Number(quote.total_price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
