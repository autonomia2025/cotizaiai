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
        <h1 className="mt-2 text-3xl font-semibold">Bienvenido de vuelta</h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesion para acceder a tu workspace.
        </p>
      </div>

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
