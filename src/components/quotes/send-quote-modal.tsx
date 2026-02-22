"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { sendQuoteAction } from "@/lib/actions/quotes";
import { ActionResult } from "@/lib/actions/types";

type SendQuoteModalProps = {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  html: string;
};

const initialState: ActionResult = {};

export const SendQuoteModal = ({
  quoteId,
  customerName,
  customerEmail,
  subject,
  html,
}: SendQuoteModalProps) => {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(sendQuoteAction, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      return;
    }

    if (state?.success) {
      toast.success("Quote sent");
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Preview &amp; Send</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email preview</DialogTitle>
          <DialogDescription>
            Review the email before sending.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">To:</span> {customerName} &lt;
            {customerEmail}&gt;
          </p>
          <p>
            <span className="font-semibold">Subject:</span> {subject}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <form action={formAction}>
          <input type="hidden" name="quote_id" value={quoteId} />
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton>Confirmar envio</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
