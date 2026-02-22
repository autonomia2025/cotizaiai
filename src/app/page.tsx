import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          QuoteAI
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Ingresar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Comenzar</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Sistema de cotizaciones con IA
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Genera, envia y hace seguimiento de cotizaciones en minutos.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              QuoteAI combina IA, automatizacion de emails y PDFs en una sola
              plataforma para equipos comerciales multi-tenant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Empezar prueba</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Abrir demo</Link>
              </Button>
            </div>
          </div>
          <Card className="relative overflow-hidden border-border/60 bg-white/70 p-8 shadow-xl shadow-muted/40">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/60 to-muted/70" />
            <div className="relative flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Workspace en vivo
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Actividad de hoy
                </h2>
              </div>
              <div className="grid gap-4">
                {[
                  "IA genero 3 borradores",
                  "2 propuestas aceptadas",
                  "$84k en ingresos esta semana",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-muted/60 p-4 text-xs text-muted-foreground">
                El agente de QuoteAI monitorea tu bandeja y prepara respuestas
                para aprobacion.
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Arquitectura multi-tenant",
              description:
                "Aisla datos por organizacion con seguridad a nivel de fila.",
            },
            {
              title: "Generacion con IA",
              description:
                "Genera precios, items y resumenes en segundos.",
            },
            {
              title: "Flujos de email",
              description:
                "Envia, recibe y redacta respuestas con analitica integrada.",
            },
          ].map((card) => (
            <Card key={card.title} className="border-border/60 bg-white/70 p-6">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
