import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganizationId } from "@/lib/supabase/helpers";
import { updateEmailSettings, updateOrganization } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const organizationId = await getCurrentOrganizationId();
  const supabase = createSupabaseServerClient();

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
        <form action={updateOrganization} className="mt-4 grid gap-4">
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
          <Button type="submit">Save organization</Button>
        </form>
      </Card>

      <Card className="border-border/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Email settings</h2>
        <form action={updateEmailSettings} className="mt-4 grid gap-4">
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
          <Button type="submit">Save email settings</Button>
        </form>
      </Card>
    </div>
  );
}
