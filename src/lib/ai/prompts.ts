type Service = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  company: string | null;
};

type Organization = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
};

type Quote = {
  id: string;
  title: string;
  description: string | null;
  total_price: number;
};

type EmailMessage = {
  direction: "inbound" | "outbound";
  content: string;
  created_at: string;
};

export const quoteGenerationPrompt = (input: {
  organization: Organization;
  customer: Customer;
  services: Service[];
  request: string;
}) => {
  return `You are QuoteAI, an expert sales quoting agent.
Generate a concise professional quote JSON.

Organization:
${input.organization.name}
${input.organization.description ?? ""}

Customer:
${input.customer.name} (${input.customer.email}) ${input.customer.company ?? ""}

Available services:
${input.services
  .map(
    (service) =>
      `- ${service.name} | ${service.description ?? ""} | Base: ${service.base_price}`
  )
  .join("\n")}

Customer request:
${input.request}

Return JSON with keys: title, description, line_items (array of {name, description, price, service_id}), total_price.
Only select services from the available services list. Never invent services.
Ensure prices are numbers in USD and total_price is sum of line_items.`;
};

export const emailReplyPrompt = (input: {
  organization: Organization;
  customer: Customer;
  quote: Quote | null;
  emailHistory: EmailMessage[];
  quotePublicUrl?: string | null;
}) => {
  return `You are QuoteAI, an assistant replying to a sales email.
Write a helpful, professional reply draft.

Organization:
${input.organization.name}

Customer:
${input.customer.name} (${input.customer.email}) ${input.customer.company ?? ""}

Quote context:
${input.quote ? `${input.quote.title} - ${input.quote.total_price}` : "No quote yet"}
${input.quotePublicUrl ? `Public quote URL: ${input.quotePublicUrl}` : ""}

Email history (most recent last):
${input.emailHistory
  .map((message) => `${message.direction}: ${message.content}`)
  .join("\n")}

Return JSON with keys: subject, body.
Keep it short, confident, and clear about next steps.`;
};
