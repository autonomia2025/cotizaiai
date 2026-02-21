import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getUserContext } from "@/lib/supabase/helpers";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getUserContext();

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
