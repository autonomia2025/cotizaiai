import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendThreadReply } from "@/lib/actions/email";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

type PageProps = {
  params: { id: string };
};

export default async function EmailThreadDetailPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
  const organizationId = await getCurrentOrganizationId();
  const { data: thread } = await supabase
    .from("email_threads")
    .select("id, subject")
    .eq("id", params.id)
    .eq("organization_id", organizationId ?? "")
    .single();

  const { data: messages } = await supabase
    .from("email_messages")
    .select("id, direction, content, created_at, is_suggested, email_threads!inner(organization_id)")
    .eq("thread_id", params.id)
    .eq("email_threads.organization_id", organizationId ?? "")
    .order("created_at", { ascending: true });

  if (!thread) {
    return <div>Thread not found.</div>;
  }

  const suggested = messages
    ?.filter((message) => message.is_suggested)
    .slice(-1)[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Email Thread
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {thread.subject ?? "Quote conversation"}
        </h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.direction === "inbound"
                  ? "bg-muted/60"
                  : "ml-auto bg-white"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.is_suggested ? (
                <p className="mt-2 text-xs text-muted-foreground">AI suggested</p>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Reply</h2>
        <form action={sendThreadReply} className="mt-4 space-y-4">
          <input type="hidden" name="thread_id" value={thread.id} />
          <Textarea
            name="body"
            rows={5}
            placeholder="Write your reply"
            defaultValue={suggested?.content ?? ""}
            required
          />
          <Button type="submit">Send reply</Button>
        </form>
      </Card>
    </div>
  );
}
