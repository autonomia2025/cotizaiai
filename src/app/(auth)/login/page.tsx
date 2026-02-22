import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          QuoteAI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your workspace.
        </p>
      </div>

      <ActionForm action={signIn} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <SubmitButton className="w-full">Sign in</SubmitButton>
      </ActionForm>

      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="font-semibold text-foreground" href="/signup">
          Create one
        </Link>
      </p>
    </div>
  );
}
