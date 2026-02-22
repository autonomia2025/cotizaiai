import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import {
  deleteCustomerAction,
  updateCustomerAction,
} from "@/lib/actions/customers";

type PageProps = {
  params: { id: string };
};

export default async function CustomerDetailPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();
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

  const statusLabels: Record<string, string> = {
    draft: "Borrador",
    sent: "Enviada",
    accepted: "Aceptada",
    rejected: "Rechazada",
  };

  if (!customer) {
    return <div>Cliente no encontrado.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Cliente
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{customer.name}</h1>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
        {customer.company ? (
          <p className="text-sm text-muted-foreground">{customer.company}</p>
        ) : null}
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Editar cliente</h2>
        <ActionForm
          action={updateCustomerAction}
          className="mt-4 grid gap-4 md:grid-cols-3"
          successMessage="Cliente actualizado"
        >
          <input type="hidden" name="customer_id" value={customer.id} />
          <Input
            name="name"
            placeholder="Nombre completo"
            defaultValue={customer.name}
            required
          />
          <Input
            name="email"
            placeholder="Email"
            type="email"
            defaultValue={customer.email}
            required
          />
          <Input
            name="company"
            placeholder="Empresa"
            defaultValue={customer.company ?? ""}
          />
          <div className="md:col-span-3">
            <SubmitButton>Guardar cambios</SubmitButton>
          </div>
        </ActionForm>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-destructive">
          Eliminar cliente
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta accion eliminara el cliente y sus datos relacionados.
        </p>
        <ActionForm
          action={deleteCustomerAction}
          className="mt-4"
          successMessage="Cliente eliminado"
        >
          <input type="hidden" name="customer_id" value={customer.id} />
          <SubmitButton
            variant="destructive"
            onClick={(event) => {
              if (!window.confirm("¿Eliminar este cliente?")) {
                event.preventDefault();
              }
            }}
          >
            Eliminar cliente
          </SubmitButton>
        </ActionForm>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Cotizaciones recientes</h2>
        <div className="mt-4 space-y-3">
          {quotes?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no hay cotizaciones.
            </p>
          ) : (
            quotes?.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3"
              >
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
