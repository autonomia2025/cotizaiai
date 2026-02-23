import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { createCustomer } from "@/lib/actions/customers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export default async function CustomersPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, company, created_at")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Clientes
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Directorio de clientes</h1>
      </div>

      <Card className="border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Crear cliente</h2>
        <ActionForm
          action={createCustomer}
          className="mt-4 grid gap-4 md:grid-cols-3"
          successMessage="Cliente agregado"
        >
          <Input name="name" placeholder="Nombre completo" required />
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="company" placeholder="Empresa" />
          <div className="md:col-span-3">
            <SubmitButton>Agregar cliente</SubmitButton>
          </div>
        </ActionForm>
      </Card>

      <div className="grid gap-4">
        {customers?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-100 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Aun no hay clientes
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Agrega tu primer cliente arriba
            </p>
          </div>
        ) : (
          customers?.map((customer) => (
            <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="flex items-center justify-between border-gray-100 bg-white px-6 py-4 transition hover:shadow-sm cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {customer.company ?? ""}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
