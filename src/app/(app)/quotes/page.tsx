import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { CustomerSelect } from "@/components/forms/customer-select";
import { ActionForm } from "@/components/forms/action-form";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { generateQuoteFromRequest } from "@/lib/actions/quotes";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();

  const statusStyles: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-blue-100 text-blue-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    draft: "borrador",
    sent: "enviada",
    accepted: "aceptada",
    rejected: "rechazada",
  };

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
          Cotizaciones
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Cotizaciones con IA</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Crear nueva cotizacion</h2>
        <ActionForm
          action={generateQuoteFromRequest}
          className="mt-4 grid gap-4"
        >
          <CustomerSelect customers={customers ?? []} />
          <Textarea
            name="request"
            placeholder="Describe lo que necesita el cliente"
            rows={4}
            required
          />
          <SubmitButton>Generar cotizacion con IA</SubmitButton>
        </ActionForm>
      </Card>

      <div className="grid gap-4">
        {quotes?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/40 px-6 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Aun no hay cotizaciones
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Genera tu primera cotizacion arriba
            </p>
          </div>
        ) : (
          quotes?.map((quote) => (
            <Link key={quote.id} href={`/quotes/${quote.id}`}>
              <Card className="flex items-center justify-between border-border/60 bg-white/70 px-6 py-4 transition hover:shadow-lg cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">{quote.title}</p>
                  <Badge
                    className={`mt-2 w-fit ${statusStyles[quote.status] ?? ""}`}
                    variant="secondary"
                  >
                    {statusLabels[quote.status] ?? quote.status}
                  </Badge>
                </div>
                <p className="text-sm font-semibold">
                  ${Number(quote.total_price).toFixed(2)}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
