import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
