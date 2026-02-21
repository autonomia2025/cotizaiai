import OpenAI from "openai";
import { z } from "zod";
import { emailReplyPrompt, quoteGenerationPrompt } from "./prompts";

const quoteSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  line_items: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable().optional(),
      price: z.number(),
      service_id: z.string().nullable().optional(),
    })
  ),
  total_price: z.number(),
});

const emailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export const generateQuoteWithAI = async (input: Parameters<
  typeof quoteGenerationPrompt
>[0]) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = quoteGenerationPrompt(input);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return quoteSchema.parse(JSON.parse(content));
};

export const generateEmailReply = async (input: Parameters<
  typeof emailReplyPrompt
>[0]) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = emailReplyPrompt(input);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return emailSchema.parse(JSON.parse(content));
};
