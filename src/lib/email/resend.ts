import { Resend } from "resend";

export type QuoteEmailPayload = {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
  replyTo?: string;
  headers?: Record<string, string>;
};

export const sendQuoteEmail = async (payload: QuoteEmailPayload) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
    html: payload.html,
    attachments: payload.attachments,
    replyTo: payload.replyTo,
    headers: payload.headers,
  });
};
