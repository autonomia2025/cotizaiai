import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import {
  inviteMember,
  updateEmailSettings,
  updateOrganization,
} from "@/lib/actions/settings";

export default async function SettingsPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = await createSupabaseServerClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, description, logo_url")
    .eq("id", organizationId ?? "")
    .single();

  const { data: emailSettings } = await supabase
    .from("email_settings")
    .select("from_name, from_email, reply_to, signature")
    .eq("organization_id", organizationId ?? "")
    .maybeSingle();

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, email, created_at, accepted_at")
    .eq("organization_id", organizationId ?? "")
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  const { data: members } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("organization_id", organizationId ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Workspace settings</h1>
      </div>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Organization</h2>
        <ActionForm
          action={updateOrganization}
          className="mt-4 grid gap-4"
          successMessage="Organization updated"
        >
          <Input
            name="name"
            placeholder="Organization name"
            defaultValue={organization?.name ?? ""}
            required
          />
          <Textarea
            name="description"
            placeholder="Organization description"
            rows={3}
            defaultValue={organization?.description ?? ""}
          />
          <Input
            name="logo_url"
            placeholder="Logo URL"
            defaultValue={organization?.logo_url ?? ""}
          />
          <SubmitButton>Save organization</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Email settings</h2>
        <ActionForm
          action={updateEmailSettings}
          className="mt-4 grid gap-4"
          successMessage="Email settings updated"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="from_name"
              placeholder="From name"
              defaultValue={emailSettings?.from_name ?? ""}
            />
            <Input
              name="from_email"
              placeholder="From email"
              defaultValue={emailSettings?.from_email ?? ""}
            />
          </div>
          <Input
            name="reply_to"
            placeholder="Reply-to email"
            defaultValue={emailSettings?.reply_to ?? ""}
          />
          <Textarea
            name="signature"
            placeholder="Email signature"
            rows={4}
            defaultValue={emailSettings?.signature ?? ""}
          />
          <SubmitButton>Save email settings</SubmitButton>
        </ActionForm>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Team members</h2>
        <ActionForm
          action={inviteMember}
          className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]"
          successMessage="Invite sent"
        >
          <Input name="email" placeholder="member@company.com" required />
          <SubmitButton>Send invite</SubmitButton>
        </ActionForm>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Pending invitations
          </p>
          {invitations?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending invitations
            </p>
          ) : (
            invitations?.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Invited {new Date(invite.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Members
          </p>
          {members?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet</p>
          ) : (
            members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {member.name || member.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {member.role}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
