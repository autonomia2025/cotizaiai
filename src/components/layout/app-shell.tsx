import Link from "next/link";
import { ReactNode } from "react";
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
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Services", href: "/services", icon: Layers },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Email Threads", href: "/email-threads", icon: Mail },
  { name: "Settings", href: "/settings", icon: Settings },
];

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-72 lg:flex-col">
          <div className="flex h-screen flex-col gap-8 border-r border-border/70 bg-white/70 p-8 backdrop-blur">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                QuoteAI
              </div>
              <p className="mt-2 text-2xl font-semibold">Sales OS</p>
            </div>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto rounded-2xl border border-border/70 bg-gradient-to-br from-white to-muted p-4">
              <p className="text-sm font-semibold">AI Agent Ready</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Automate quotes, follow-ups, and reply drafts.
              </p>
              <Button className="mt-4 w-full" size="sm">
                Open Agent
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="border-b border-border/60 bg-white/70 px-6 py-4 backdrop-blur lg:hidden">
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
