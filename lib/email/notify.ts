import { Resend } from "resend";

export interface NewToolsFormRow {
  id: string;
  tool_slug: string;
  email: string;
  name: string | null;
  would_pay: string | null;
  how_solve_today: string | null;
  must_have_reason: string | null;
  additional_feedback: string | null;
  tool_answers: Record<string, string> | null;
  referrer: string | null;
  landing_query: string | null;
  created_at: string;
}

const TOOL_NAMES: Record<string, string> = {
  snapback: "SnapBack",
  encore: "Encore",
  signsync: "SignSync",
  "shopify-tools": "Shopify Tools",
  reftrack: "RefTrack",
  shipnotes: "ShipNotes",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#5B5B63;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:4px 0;color:#0A0A0A;font-size:13px">${escapeHtml(value)}</td></tr>`;
}

function renderLeadEmail(data: NewToolsFormRow, toolName: string): string {
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px">
      <p style="font-size:15px;color:#0A0A0A"><strong>${escapeHtml(toolName)}</strong> has a new interested visitor.</p>
      <table>
        ${row("Email", data.email)}
        ${row("Name", data.name)}
        ${row("Referrer", data.referrer)}
        ${row("Landing query", data.landing_query)}
        ${row("When", new Date(data.created_at).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC")}
      </table>
      <p style="font-size:12px;color:#5B5B63;margin-top:16px">Reply to this email to reach them directly. They have not answered the detailed questions yet — you'll get a second email if they do.</p>
    </div>`;
}

function renderSurveyEmail(data: NewToolsFormRow, toolName: string): string {
  const answerRows = Object.entries(data.tool_answers ?? {})
    .map(([key, value]) => row(key, value))
    .join("");
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px">
      <p style="font-size:15px;color:#0A0A0A"><strong>${escapeHtml(data.email)}</strong> answered the detailed questions for <strong>${escapeHtml(toolName)}</strong>.</p>
      <table>
        ${row("Would pay", data.would_pay)}
        ${row("How they solve this today", data.how_solve_today)}
        ${row("What makes this a must-have", data.must_have_reason)}
        ${answerRows}
        ${row("Additional feedback", data.additional_feedback)}
      </table>
    </div>`;
}

/**
 * Fire-and-forget notification — callers should invoke this from `after()`
 * and never await it on the request path. Errors are swallowed (logged
 * only) so a Resend outage never turns into a user-facing form failure;
 * the newtools_form row is already saved by the time this runs.
 */
export async function sendNewToolNotification(data: NewToolsFormRow, kind: "lead" | "survey"): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.error("[newtools-form] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification email");
    return;
  }

  const toolName = TOOL_NAMES[data.tool_slug] ?? data.tool_slug;
  const from = process.env.RESEND_FROM_ADDRESS || "Sohovi Labs <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject:
        kind === "lead"
          ? `New interest: ${toolName} — ${data.email}`
          : `Detailed answers: ${toolName} — would pay: ${data.would_pay ?? "n/a"}`,
      html: kind === "lead" ? renderLeadEmail(data, toolName) : renderSurveyEmail(data, toolName),
    });
    // The Resend SDK returns { data, error } on both success and failure —
    // it does not throw for API-level errors (e.g. bad key, rate limit),
    // so this check is required or a real failure would be silently missed.
    if (error) {
      console.error(`[newtools-form] Resend rejected the ${kind} notification email`, error);
    }
  } catch (err) {
    console.error(`[newtools-form] Failed to send ${kind} notification email`, err);
  }
}
