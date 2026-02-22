import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { signUpWithOrganization } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          QuoteAI
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Crea tu workspace</h1>
        <p className="text-sm text-muted-foreground">
          Configura tu organizacion en segundos.
        </p>
      </div>

      <ActionForm action={signUpWithOrganization} className="space-y-4">
        <Input name="name" placeholder="Tu nombre" required />
        <Input name="organization" placeholder="Nombre de la organizacion" required />
        <Input name="email" type="email" placeholder="Email de trabajo" required />
        <Input
          name="password"
          type="password"
          placeholder="Contrasena"
          required
        />
        <SubmitButton className="w-full">Crear cuenta</SubmitButton>
      </ActionForm>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link className="font-semibold text-foreground" href="/login">
          Iniciar sesion
        </Link>
      </p>
    </div>
  );
}
