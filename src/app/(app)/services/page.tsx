import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
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
          Services
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Service catalog</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Create service</h2>
        <ActionForm
          action={createService}
          className="mt-4 grid gap-4"
          successMessage="Service added"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Service name" required />
            <Input
              name="base_price"
              placeholder="Base price"
              type="number"
              step="0.01"
              required
            />
          </div>
          <Textarea name="description" placeholder="Description" rows={3} />
          <SubmitButton>Add service</SubmitButton>
        </ActionForm>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {services?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/40 px-6 py-12 text-center md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              No services yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your first service above
            </p>
          </div>
        ) : (
          services?.map((service) => (
            <Card key={service.id} className="border-border/60 bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-sm font-semibold">
                  ${Number(service.base_price).toFixed(2)}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {service.description}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
