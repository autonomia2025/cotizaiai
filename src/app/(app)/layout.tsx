import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getUserContext } from "@/lib/supabase/helpers";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, missingProfile } = await getUserContext();

  if (missingProfile) {
    redirect("/login?error=missing-profile");
  }

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
