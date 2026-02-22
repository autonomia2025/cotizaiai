import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendThreadReply } from "@/lib/actions/email";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";

type PageProps = {
  params: { id: string };
};

export default async function EmailThreadDetailPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();
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
    return <div>Conversacion no encontrada.</div>;
  }

  const suggested = messages
    ?.filter((message) => message.is_suggested)
    .slice(-1)[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Correo
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {thread.subject ?? "Conversacion de cotizacion"}
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
                <p className="mt-2 text-xs text-muted-foreground">
                  Sugerido por IA
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Responder</h2>
        <ActionForm
          action={sendThreadReply}
          className="mt-4 space-y-4"
          successMessage="Respuesta enviada"
        >
          <input type="hidden" name="thread_id" value={thread.id} />
          <Textarea
            name="body"
            rows={5}
            placeholder="Escribe tu respuesta"
            defaultValue={suggested?.content ?? ""}
            required
          />
          <SubmitButton>Enviar respuesta</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
