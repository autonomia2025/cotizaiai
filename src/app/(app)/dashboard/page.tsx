import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export default async function DashboardPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();

  const [{ count: totalQuotes }, { count: acceptedQuotes }, { data: revenue }] =
    await Promise.all([
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId ?? ""),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId ?? "")
        .eq("status", "accepted"),
      supabase
        .from("quotes")
        .select("total_price")
        .eq("organization_id", organizationId ?? "")
        .eq("status", "accepted"),
    ]);

  const revenueTotal =
    revenue?.reduce((sum, quote) => sum + Number(quote.total_price), 0) ?? 0;

  const { data: recentQuotes } = await supabase
    .from("quotes")
    .select("id, title, status, total_price, created_at")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  const statusLabels: Record<string, string> = {
    draft: "Borrador",
    sent: "Enviada",
    accepted: "Aceptada",
    rejected: "Rechazada",
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Panel
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Resumen</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Cotizaciones", value: totalQuotes ?? 0 },
          { label: "Aceptadas", value: acceptedQuotes ?? 0 },
          { label: "Ingresos", value: `$${revenueTotal.toFixed(2)}` },
        ].map((stat) => (
          <Card key={stat.label} className="border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Actividad reciente</h2>
        </div>
        <div className="mt-6 space-y-4">
          {recentQuotes?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-100 bg-white px-6 py-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Aun no hay actividad reciente
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Genera tu primera cotizacion para ver novedades aqui
              </p>
            </div>
          ) : (
            recentQuotes?.map((quote) => (
              <Link key={quote.id} href={`/quotes/${quote.id}`}>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 transition hover:shadow-sm cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{quote.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {statusLabels[quote.status] ?? quote.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    ${Number(quote.total_price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
