import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpWithOrganization } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          QuoteAI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-muted-foreground">
          Set up your organization in seconds.
        </p>
      </div>

      <form action={signUpWithOrganization} className="space-y-4">
        <Input name="name" placeholder="Your name" required />
        <Input name="organization" placeholder="Organization name" required />
        <Input name="email" type="email" placeholder="Work email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-foreground" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
