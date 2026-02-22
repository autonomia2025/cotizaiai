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

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Email Threads
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Inbox</h1>
      </div>

      <div className="grid gap-4">
        {threads?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/40 px-6 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No email threads yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Send a quote to start a conversation
            </p>
          </div>
        ) : (
          threads?.map((thread) => (
            <Link key={thread.id} href={`/email-threads/${thread.id}`}>
              <Card className="flex items-center justify-between border-border/60 bg-white/70 px-6 py-4 transition hover:shadow-lg cursor-pointer">
                <div>
                  <p className="text-sm font-semibold">
                    {thread.subject ?? "Quote thread"}
                  </p>
                  <p className="text-xs text-muted-foreground">{thread.status}</p>
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
