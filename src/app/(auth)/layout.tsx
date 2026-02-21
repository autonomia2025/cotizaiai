import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border/60 bg-white/70 p-8 shadow-xl shadow-muted/40">
        {children}
      </div>
    </div>
  );
}
