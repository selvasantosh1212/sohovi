import { Resend } from "resend";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * The single outbound-email path.
 *
 * Returns `false` rather than throwing: every caller so far sends a
 * notification about work that has already been committed, so a Resend outage
 * must never surface as a failure of the thing being notified about.
 *
 * The Resend SDK returns `{ data, error }` on both success and failure — it
 * does not throw for API-level errors like a bad key or a rate limit — so the
 * `error` check below is required or a real failure would pass silently.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not set — skipping send");
    return false;
  }

  const from = process.env.RESEND_FROM_ADDRESS || "Sohovi <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, replyTo, subject, html });
    if (error) {
      console.error("[email] Resend rejected the message", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send", err);
    return false;
  }
}

/** Escapes untrusted text for interpolation into an HTML email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
