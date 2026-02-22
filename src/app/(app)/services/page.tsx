import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { ServiceCard } from "@/components/services/service-card";
import { createService } from "@/lib/actions/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export default async function ServicesPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, base_price")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Servicios
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Catalogo de servicios</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Crear servicio</h2>
        <ActionForm
          action={createService}
          className="mt-4 grid gap-4"
          successMessage="Servicio agregado"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Nombre del servicio" required />
            <Input
              name="base_price"
              placeholder="Precio base"
              type="number"
              step="0.01"
              required
            />
          </div>
          <Textarea name="description" placeholder="Descripcion" rows={3} />
          <SubmitButton>Agregar servicio</SubmitButton>
        </ActionForm>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {services?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/40 px-6 py-12 text-center md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              Aun no hay servicios
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Agrega tu primer servicio arriba
            </p>
          </div>
        ) : (
          services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>
    </div>
  );
}
