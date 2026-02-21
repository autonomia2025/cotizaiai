import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCustomer } from "@/lib/actions/customers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export default async function CustomersPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = createSupabaseServerClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, company, created_at")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Customers
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Customer directory</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Create customer</h2>
        <form action={createCustomer} className="mt-4 grid gap-4 md:grid-cols-3">
          <Input name="name" placeholder="Full name" required />
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="company" placeholder="Company" />
          <div className="md:col-span-3">
            <Button type="submit">Add customer</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4">
        {customers?.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="flex items-center justify-between border-border/60 bg-white/70 px-6 py-4 transition hover:shadow-lg">
              <div>
                <p className="text-sm font-semibold">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {customer.company ?? ""}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
