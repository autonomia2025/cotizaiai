"use client";

import { ReactNode, useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { ActionResult } from "@/lib/actions/types";

type ActionFormProps = {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  successMessage?: string;
};

const initialState: ActionResult = {};

export const ActionForm = ({
  action,
  children,
  className,
  successMessage,
}: ActionFormProps) => {
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      return;
    }

    if (state?.success && successMessage) {
      toast.success(successMessage);
    }
  }, [state, successMessage]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
};
