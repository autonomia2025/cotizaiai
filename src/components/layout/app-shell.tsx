"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Mail,
  Settings,
  Users,
  Layers,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Panel", href: "/dashboard", icon: BarChart3 },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Servicios", href: "/services", icon: Layers },
  { name: "Cotizaciones", href: "/quotes", icon: FileText },
  { name: "Correos", href: "/email-threads", icon: Mail },
  { name: "Configuracion", href: "/settings", icon: Settings },
];

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-72 lg:flex-col">
          <div className="flex h-screen flex-col gap-8 border-r border-gray-100 bg-white p-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                QuoteAI
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                Sistema comercial
              </p>
            </div>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-indigo-50 text-primary"
                        : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold">Agente listo</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Automatiza cotizaciones, seguimientos y borradores de respuesta.
              </p>
              <Button className="mt-4 w-full" size="sm" disabled>
                Proximamente
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="border-b border-gray-100 bg-white px-6 py-4 lg:hidden">
            <div className="text-base font-semibold">QuoteAI</div>
          </div>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
