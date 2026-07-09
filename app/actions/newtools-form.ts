"use server";

import { after } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewToolNotification, type NewToolsFormRow } from "@/lib/email/notify";
import {
  leadSchema,
  surveySchema,
  MIN_SUBMIT_MS,
  type LeadInput,
  type SurveyInput,
} from "@/lib/validation/newtools-form";

// Returned to a honeypot/time-trap-tripped Step 1 so the UI still shows a
// normal success state — a bot gets no signal that it was caught, and
// Step 2 (below) recognizes this id and quietly no-ops instead of writing.
const DROPPED_ID = "00000000-0000-0000-0000-000000000000";

export async function startNewToolLead(
  input: LeadInput
): Promise<{ id: string } | { error: string }> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  if (data.hpWebsite || Date.now() - data.renderedAt < MIN_SUBMIT_MS) {
    return { id: DROPPED_ID };
  }

  const supabase = createServiceClient();
  const { data: row, error } = await supabase
    .from("newtools_form")
    .insert({
      tool_slug: data.toolSlug,
      email: data.email,
      name: data.name || null,
      tool_answers: data.toolAnswers ?? {},
      referrer: data.referrer || null,
      landing_query: data.landingQuery || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  after(() => sendNewToolNotification(row as NewToolsFormRow, "lead"));

  return { id: row.id as string };
}

export async function completeNewToolSurvey(
  input: SurveyInput
): Promise<{ ok: true } | { error: string }> {
  const parsed = surveySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  if (data.id === DROPPED_ID) {
    return { ok: true };
  }

  const supabase = createServiceClient();
  const { data: row, error } = await supabase
    .from("newtools_form")
    .update({
      would_pay: data.wouldPay,
      how_solve_today: data.howSolveToday,
      must_have_reason: data.mustHaveReason,
      additional_feedback: data.additionalFeedback || null,
      tool_answers: data.toolAnswers ?? {},
      survey_completed_at: new Date().toISOString(),
    })
    .eq("id", data.id)
    .eq("tool_slug", data.toolSlug)
    .is("survey_completed_at", null)
    .select()
    .single();

  // A missing row (bad id, tool_slug mismatch, or an already-completed
  // survey being re-submitted) is never the real visitor's fault in the
  // normal flow — succeed quietly rather than surfacing a scary error.
  if (error || !row) {
    return { ok: true };
  }

  after(() => sendNewToolNotification(row as NewToolsFormRow, "survey"));

  return { ok: true };
}
