"use client";

import { useRef, useState } from "react";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { startNewToolLead, completeNewToolSurvey } from "@/app/actions/newtools-form";
import { darkenColor } from "@/lib/labs/color";
import type { Step1Field, Step2Field, ToolSlug, WouldPay } from "@/lib/validation/newtools-form";

type Phase = "cta" | "step1" | "step1-done" | "step2" | "done";

interface FeedbackFormProps {
  toolSlug: ToolSlug;
  toolName: string;
  accent: string;
  ctaLabel: string;
  waitlistHeadline: string;
  waitlistIntro: string;
  step1Field: Step1Field;
  step2Fields: Step2Field[];
  emailFootnote?: string;
  emailPlaceholder?: string;
}

const SPECIAL_KEYS = new Set(["wouldPay", "howSolveToday", "mustHaveReason", "additionalFeedback"]);

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#1A1A2E",
  padding: "11px 13px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: "13.5px", fontWeight: 600, marginBottom: "6px", color: "#1A1A2E" };

function PillGroup({
  options,
  value,
  onChange,
  accent,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              padding: "8px 15px",
              borderRadius: "9999px",
              background: active ? accent : "#FFFFFF",
              color: active ? "#fff" : "#1A1A2E",
              border: `1px solid ${active ? accent : "#E2E8F0"}`,
              cursor: "pointer",
              transition: "background-color 150ms",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldBlock({
  field,
  value,
  onChange,
  accent,
}: {
  field: Step2Field;
  value: string | undefined;
  onChange: (v: string) => void;
  accent: string;
}) {
  const optional = field.kind !== "pills" && field.optional;
  if (field.kind === "pills") {
    return (
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>{field.label}</p>
        <PillGroup options={field.options} value={value} onChange={onChange} accent={accent} />
      </div>
    );
  }
  if (field.kind === "textarea") {
    return (
      <div>
        <label style={labelStyle}>
          {field.label} {optional && <span style={{ fontWeight: 400, color: "#64748B" }}>(optional)</span>}
        </label>
        <textarea rows={2} value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
    );
  }
  return (
    <div>
      <label style={labelStyle}>
        {field.label} {optional && <span style={{ fontWeight: 400, color: "#64748B" }}>(optional)</span>}
      </label>
      <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

export function FeedbackForm({
  toolSlug,
  toolName,
  accent,
  ctaLabel,
  waitlistHeadline,
  waitlistIntro,
  step1Field,
  step2Fields,
  emailFootnote,
  emailPlaceholder = "you@company.com",
}: FeedbackFormProps) {
  const accentDark = darkenColor(accent);
  const [phase, setPhase] = useState<Phase>("cta");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [emailError, setEmailError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const renderedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const setAnswer = (key: string) => (v: string) => setAnswers((prev) => ({ ...prev, [key]: v }));

  async function submitStep1() {
    setEmailError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      const secondaryValue = answers[step1Field.key];
      const result = await startNewToolLead({
        toolSlug,
        email,
        name: step1Field.kind === "text" ? secondaryValue || "" : "",
        toolAnswers: step1Field.kind === "pills" && secondaryValue ? { [step1Field.key]: secondaryValue } : undefined,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        landingQuery: typeof window !== "undefined" ? window.location.search : "",
        hpWebsite: honeypotRef.current?.value || "",
        renderedAt: renderedAt.current,
      });
      if ("error" in result) {
        setEmailError(result.error);
        return;
      }
      setLeadId(result.id);
      setPhase("step1-done");
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitStep2() {
    setFieldError(null);
    const missing = step2Fields.find((f) => f.kind === "pills" ? !answers[f.key] : !f.optional && !answers[f.key]);
    if (missing) {
      setFieldError(`Please answer: ${missing.label}`);
      return;
    }
    setSubmitting(true);
    try {
      // Re-include the Step 1 pill answer (if any) alongside all Step 2
      // answers, since this update overwrites tool_answers wholesale —
      // "name" is excluded since it already has its own dedicated column.
      const toolAnswers: Record<string, string> = {};
      for (const [key, value] of Object.entries(answers)) {
        if (!SPECIAL_KEYS.has(key) && key !== "name") toolAnswers[key] = value;
      }
      const result = await completeNewToolSurvey({
        id: leadId!,
        toolSlug,
        wouldPay: (answers.wouldPay as WouldPay) || undefined,
        howSolveToday: answers.howSolveToday || undefined,
        mustHaveReason: answers.mustHaveReason || undefined,
        additionalFeedback: answers.additionalFeedback || undefined,
        toolAnswers,
      });
      if ("error" in result) {
        setFieldError(result.error);
        return;
      }
      setPhase("done");
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="build-this" style={{ background: "#1A1A2E", padding: "88px 0" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
            Raise your hand
          </p>
          <h2 style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.12, color: "#FFFFFF" }}>
            {waitlistHeadline}
          </h2>
          <p style={{ margin: "0 auto", fontSize: "15.5px", lineHeight: 1.6, color: "rgba(255,255,255,0.65)", maxWidth: "44ch" }}>{waitlistIntro}</p>
        </div>

        <div style={{ borderRadius: "20px", padding: "32px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          {phase === "cta" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "21px", color: "#1A1A2E" }}>Count me in</h3>
              <p style={{ margin: "0 0 22px", fontSize: "14px", color: "#64748B" }}>We&apos;ll email you the moment it&apos;s ready — nothing else.</p>
              <button
                type="button"
                onClick={() => setPhase("step1")}
                className="labs-cta-btn"
                style={
                  {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    fontSize: "15.5px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: accent,
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    "--hover-bg": accentDark,
                  } as React.CSSProperties
                }
              >
                {ctaLabel} →
              </button>
            </div>
          )}

          {phase === "step1" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "19px", color: "#1A1A2E" }}>{ctaLabel}</h3>
              <p style={{ margin: "-8px 0 0", fontSize: "13.5px", color: "#64748B" }}>Just your email — we&apos;ll let you know the moment it launches.</p>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px", color: "#1A1A2E" }}>Email</label>
                <input type="email" placeholder={emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                {emailError && <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#EF4444" }}>{emailError}</p>}
              </div>

              {step1Field.kind === "text" ? (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px", color: "#1A1A2E" }}>
                    {step1Field.label} <span style={{ fontWeight: 400, color: "#64748B" }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={step1Field.placeholder}
                    value={answers[step1Field.key] ?? ""}
                    onChange={(e) => setAnswer(step1Field.key)(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ) : (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 600, color: "#1A1A2E" }}>{step1Field.label}</p>
                  <PillGroup options={step1Field.options} value={answers[step1Field.key]} onChange={setAnswer(step1Field.key)} accent={accent} />
                </div>
              )}

              {/* Honeypot — invisible to real users, catches simple bots */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              <button
                type="button"
                onClick={submitStep1}
                disabled={submitting}
                className="labs-cta-btn"
                style={
                  {
                    width: "100%",
                    textAlign: "center",
                    padding: "13px",
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: accent,
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    opacity: submitting ? 0.6 : 1,
                    "--hover-bg": accentDark,
                  } as React.CSSProperties
                }
              >
                {submitting ? "Sending…" : "Count Me In →"}
              </button>
            </div>
          )}

          {phase === "step1-done" && (
            <div style={{ textAlign: "center" }} role="status" aria-live="polite">
              <CheckCircle2 style={{ width: "28px", height: "28px", color: "#00C9A7", marginBottom: "10px" }} />
              <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#1A1A2E" }}>You&apos;re on the list</p>
              <p style={{ margin: "0 0 24px", fontSize: "13.5px", color: "#64748B" }}>We&apos;ll email you the moment {toolName} is ready.</p>
              <div style={{ paddingTop: "20px", borderTop: "1px solid #E2E8F0" }}>
                <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 600, color: "#1A1A2E" }}>Got a minute? Help us build this right.</p>
                <button
                  type="button"
                  onClick={() => setPhase("step2")}
                  className="labs-secondary-btn"
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    padding: "10px 22px",
                    borderRadius: "9999px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    color: "#1A1A2E",
                    cursor: "pointer",
                  }}
                >
                  Answer a Few Quick Questions
                </button>
              </div>
            </div>
          )}

          {phase === "step2" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "18px", color: "#1A1A2E" }}>A few quick questions</h3>
              {step2Fields.map((f) => (
                <FieldBlock key={f.key} field={f} value={answers[f.key]} onChange={setAnswer(f.key)} accent={accent} />
              ))}
              {fieldError && <p style={{ margin: 0, fontSize: "12px", color: "#EF4444" }}>{fieldError}</p>}
              <button
                type="button"
                onClick={submitStep2}
                disabled={submitting}
                className="labs-cta-btn"
                style={
                  {
                    width: "100%",
                    textAlign: "center",
                    padding: "13px",
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    background: accent,
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    opacity: submitting ? 0.6 : 1,
                    "--hover-bg": accentDark,
                  } as React.CSSProperties
                }
              >
                {submitting ? "Sending…" : "Send My Answers →"}
              </button>
            </div>
          )}

          {phase === "done" && (
            <div style={{ textAlign: "center" }} role="status" aria-live="polite">
              <HeartHandshake style={{ width: "28px", height: "28px", color: "#00C9A7", marginBottom: "10px" }} />
              <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#1A1A2E" }}>Thank you — this genuinely helps.</p>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#64748B" }}>We read every answer. You&apos;ll hear from us as {toolName} takes shape.</p>
            </div>
          )}
        </div>

        {emailFootnote && (
          <p style={{ margin: "18px 0 0", textAlign: "center", fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>{emailFootnote}</p>
        )}
      </div>
      <style>{`.labs-cta-btn:hover:not(:disabled) { background: var(--hover-bg) !important; } .labs-secondary-btn:hover { background: #F1F5F9 !important; }`}</style>
    </section>
  );
}
