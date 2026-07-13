import { z } from "zod";

export const TOOL_SLUGS = [
  "snapback",
  "encore",
  "signsync",
  "shopify-tools",
  "reftrack",
  "shipnotes",
  "kickoffbox",
] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

export const WOULD_PAY_VALUES = ["yes", "maybe", "no"] as const;
export type WouldPay = (typeof WOULD_PAY_VALUES)[number];

/**
 * Step 1's optional secondary field, shown next to email. Either a plain
 * name field (SnapBack/Encore) or a single pill-select question specific to
 * that product (every other page) — never both.
 */
export type Step1Field =
  | { kind: "text"; key: "name"; label: string; placeholder?: string }
  | { kind: "pills"; key: string; label: string; options: { value: string; label: string }[] };

/**
 * A single Step 2 field. Pages compose their own ordered list — the set of
 * questions genuinely differs per product (some ask "would you pay", most
 * don't), so this is deliberately per-page rather than a fixed shared shape.
 * Fields keyed "wouldPay" | "howSolveToday" | "mustHaveReason" |
 * "additionalFeedback" map to their own newtools_form column; any other key
 * is folded into the tool_answers jsonb bucket.
 */
export type Step2Field =
  | { kind: "pills"; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: "textarea"; key: string; label: string; optional?: boolean }
  | { kind: "text"; key: string; label: string; optional?: boolean };

// Minimum time (ms) between form render and submit — a submit faster than
// this is almost certainly a bot filling the form programmatically.
export const MIN_SUBMIT_MS = 2000;

export const leadSchema = z.object({
  toolSlug: z.enum(TOOL_SLUGS),
  email: z.string().email("Enter a valid email"),
  name: z.string().max(100).optional().or(z.literal("")),
  // Step 1's pill-type secondary answer (if the page has one), keyed by
  // field key — merged into tool_answers at insert time.
  toolAnswers: z.record(z.string(), z.string()).optional(),
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
  wouldPay: z.enum(WOULD_PAY_VALUES).optional(),
  howSolveToday: z.string().max(2000).optional().or(z.literal("")),
  mustHaveReason: z.string().max(2000).optional().or(z.literal("")),
  additionalFeedback: z.string().max(2000).optional().or(z.literal("")),
  // Full merged answer set for this page's Step 2 fields (re-includes any
  // Step 1 pill answer so the final row is complete after this overwrite).
  toolAnswers: z.record(z.string(), z.string()).optional(),
});
export type SurveyInput = z.infer<typeof surveySchema>;
