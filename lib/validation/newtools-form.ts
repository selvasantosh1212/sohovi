import { z } from "zod";

export const TOOL_SLUGS = [
  "snapback",
  "encore",
  "signsync",
  "shopify-tools",
  "reftrack",
  "shipnotes",
] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

export const WOULD_PAY_VALUES = ["yes", "maybe", "no"] as const;
export type WouldPay = (typeof WOULD_PAY_VALUES)[number];

/** A single tool-specific Step 2 question. Rendered by FeedbackForm. */
export interface LabsQuestion {
  key: string;
  label: string;
  type: "select" | "text";
  options?: { value: string; label: string }[];
  allowOther?: boolean;
  required?: boolean;
}

// Minimum time (ms) between form render and submit — a submit faster than
// this is almost certainly a bot filling the form programmatically.
export const MIN_SUBMIT_MS = 2000;

export const leadSchema = z.object({
  toolSlug: z.enum(TOOL_SLUGS),
  email: z.string().email("Enter a valid email"),
  name: z.string().max(100).optional().or(z.literal("")),
  referrer: z.string().max(500).optional().or(z.literal("")),
  landingQuery: z.string().max(200).optional().or(z.literal("")),
  // Honeypot — real users never see or fill this field.
  hpWebsite: z.string().max(200).optional().or(z.literal("")),
  renderedAt: z.number(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const surveySchema = z.object({
  id: z.string().uuid(),
  toolSlug: z.enum(TOOL_SLUGS),
  wouldPay: z.enum(WOULD_PAY_VALUES),
  howSolveToday: z.string().min(1, "Tell us how you handle this today").max(2000),
  mustHaveReason: z.string().min(1, "This one helps us the most").max(2000),
  additionalFeedback: z.string().max(2000).optional().or(z.literal("")),
  toolAnswers: z.record(z.string(), z.string()).optional(),
});
export type SurveyInput = z.infer<typeof surveySchema>;
