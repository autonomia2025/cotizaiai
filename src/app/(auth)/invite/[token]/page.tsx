import { ActionForm } from "@/components/forms/action-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { acceptInvitation } from "@/lib/actions/settings";

type PageProps = {
  params: { token: string };
};

export default async function InvitePage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("email, accepted_at")
    .eq("token", params.token)
    .single();

  if (!invitation || invitation.accepted_at) {
    return (
      <Card className="border-border/60 bg-white/70 p-8">
        <p className="text-sm font-semibold">Invitacion invalida</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Este enlace es invalido o ya fue utilizado.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          QuoteAI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Aceptar invitacion</h1>
        <p className="text-sm text-muted-foreground">
          Unete con el email {invitation.email}.
        </p>
      </div>

      <ActionForm action={acceptInvitation} className="space-y-4">
        <input type="hidden" name="token" value={params.token} />
        <Input name="name" placeholder="Tu nombre" required />
        <Input
          name="password"
          type="password"
          placeholder="Crea una contrasena"
          required
        />
        <SubmitButton className="w-full">Crear cuenta</SubmitButton>
      </ActionForm>
    </div>
  );
}
