import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

export default async function EmailThreadsPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();

  const { data: threads } = await supabase
    .from("email_threads")
    .select("id, subject, status, created_at, customer_id")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  const statusLabels: Record<string, string> = {
    open: "Abierto",
    closed: "Cerrado",
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Correos
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Bandeja</h1>
      </div>

      <div className="grid gap-4">
        {threads?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-100 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Aun no hay conversaciones
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Envia una cotizacion para iniciar una conversacion
            </p>
          </div>
        ) : (
          threads?.map((thread) => (
            <Link
              key={thread.id}
              href={`/email-threads/${thread.id}`}
              className="block"
            >
              <Card className="flex w-full items-center justify-between border-gray-100 bg-white px-6 py-4 transition hover:shadow-sm cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">
                    {thread.subject ?? "Conversacion de cotizacion"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {statusLabels[thread.status] ?? thread.status}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
