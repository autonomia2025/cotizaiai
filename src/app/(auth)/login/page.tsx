import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { signIn } from "@/lib/actions/auth";

type LoginPageProps = {
  searchParams?: { error?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorMessage =
    searchParams?.error === "missing-profile"
      ? "Tu cuenta no tiene perfil asociado. Contacta soporte."
      : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          QuoteAI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Bienvenido de vuelta</h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesion para acceder a tu workspace.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <ActionForm action={signIn} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Contrasena"
          required
        />
        <SubmitButton className="w-full">Ingresar</SubmitButton>
      </ActionForm>

      <p className="text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link className="font-semibold text-foreground" href="/signup">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
