# QuoteAI

AI-powered multi-tenant sales quoting platform.

## Quickstart

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Create a storage bucket named `quotes` (public).
3. Copy `.env.example` to `.env.local` and fill values.
4. Install dependencies and run the app.

```bash
npm install
npm run dev
```

## Email webhook

Configure Resend inbound routing to `POST /api/email/webhook`.
Set `RESEND_WEBHOOK_SECRET` to verify incoming signatures.

## AI prompts

Prompt modules live in `src/lib/ai/prompts.ts`.
