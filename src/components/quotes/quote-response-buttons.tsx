"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type QuoteResponseButtonsProps = {
  quoteId: string;
  status: "draft" | "sent" | "accepted" | "rejected";
};

export const QuoteResponseButtons = ({
  quoteId,
  status,
}: QuoteResponseButtonsProps) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const respond = async (action: "accepted" | "rejected") => {
    setPending(true);
    try {
      const response = await fetch("/api/quotes/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, action }),
      });
      const result = await response.json();
      if (!response.ok || result?.error) {
        toast.error(result?.error ?? "Unable to update quote");
        return;
      }
      toast.success(
        action === "accepted" ? "Quote accepted" : "Quote rejected"
      );
      router.refresh();
    } catch (error) {
      toast.error("Unable to update quote");
    } finally {
      setPending(false);
    }
  };

  if (status === "accepted") {
    return (
      <p className="mt-6 text-sm font-semibold text-emerald-600">
        ✓ Quote accepted
      </p>
    );
  }

  if (status === "rejected") {
    return (
      <p className="mt-6 text-sm font-semibold text-red-500">
        ✗ Quote rejected
      </p>
    );
  }

  if (status !== "sent") {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => respond("accepted")}
        disabled={pending}
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
      >
        ✓ Aceptar cotizacion
      </button>
      <button
        type="button"
        onClick={() => respond("rejected")}
        disabled={pending}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
      >
        ✗ Rechazar cotizacion
      </button>
    </div>
  );
};
