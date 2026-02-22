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
        <p className="text-sm font-semibold">Invitation invalid</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This invite link is invalid or has already been used.
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
        <h1 className="mt-2 text-3xl font-semibold">Accept invitation</h1>
        <p className="text-sm text-muted-foreground">
          Join {invitation.email} invitation.
        </p>
      </div>

      <ActionForm action={acceptInvitation} className="space-y-4">
        <input type="hidden" name="token" value={params.token} />
        <Input name="name" placeholder="Your name" required />
        <Input
          name="password"
          type="password"
          placeholder="Create a password"
          required
        />
        <SubmitButton className="w-full">Create account</SubmitButton>
      </ActionForm>
    </div>
  );
}
