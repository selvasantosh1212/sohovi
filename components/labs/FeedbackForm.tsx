"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { startNewToolLead, completeNewToolSurvey } from "@/app/actions/newtools-form";
import type { LabsQuestion, ToolSlug, WouldPay } from "@/lib/validation/newtools-form";

type Phase = "cta" | "step1" | "step1-done" | "step2" | "done";

interface FeedbackFormProps {
  toolSlug: ToolSlug;
  toolName: string;
  accent: string;
  ctaLabel: string;
  questions: LabsQuestion[];
}

const leadFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().max(100).optional(),
});
type LeadFormValues = z.infer<typeof leadFormSchema>;

const surveyFormSchema = z.object({
  wouldPay: z.enum(["yes", "maybe", "no"], { message: "Pick one" }),
  howSolveToday: z.string().min(1, "Tell us how you handle this today"),
  mustHaveReason: z.string().min(1, "This one helps us the most"),
  additionalFeedback: z.string().optional(),
});
type SurveyFormValues = z.infer<typeof surveyFormSchema>;

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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors"
            style={{
              background: active ? accent : "var(--paper)",
              color: active ? "#fff" : "var(--ink)",
              border: `1px solid ${active ? accent : "var(--hair-strong)"}`,
            }}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid var(--hair-strong)",
  background: "var(--paper)",
  color: "var(--ink)",
  padding: "10px 12px",
  fontSize: "14px",
  outline: "none",
};

export function FeedbackForm({ toolSlug, toolName, accent, ctaLabel, questions }: FeedbackFormProps) {
  const [phase, setPhase] = useState<Phase>("cta");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [toolAnswers, setToolAnswers] = useState<Record<string, string>>({});
  const [toolAnswerError, setToolAnswerError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const leadForm = useForm<LeadFormValues>({ resolver: zodResolver(leadFormSchema) });
  const surveyForm = useForm<SurveyFormValues>({ resolver: zodResolver(surveyFormSchema) });

  const submitLead = leadForm.handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await startNewToolLead({
        toolSlug,
        email: values.email,
        name: values.name || "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        landingQuery: typeof window !== "undefined" ? window.location.search : "",
        hpWebsite: honeypotRef.current?.value || "",
        renderedAt: renderedAt.current,
      });
      if ("error" in result) {
        setServerError(result.error);
        return;
      }
      setLeadId(result.id);
      setPhase("step1-done");
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  });

  const submitSurvey = surveyForm.handleSubmit(async (values) => {
    setToolAnswerError(null);
    const missingRequired = questions.find((q) => q.required && !toolAnswers[q.key]);
    if (missingRequired) {
      setToolAnswerError(`Please answer: ${missingRequired.label}`);
      return;
    }
    setServerError(null);
    try {
      const result = await completeNewToolSurvey({
        id: leadId!,
        toolSlug,
        wouldPay: values.wouldPay as WouldPay,
        howSolveToday: values.howSolveToday,
        mustHaveReason: values.mustHaveReason,
        additionalFeedback: values.additionalFeedback || "",
        toolAnswers,
      });
      if ("error" in result) {
        setServerError(result.error);
        return;
      }
      setPhase("done");
    } catch {
      toast.error("Something went wrong — please try again.");
    }
  });

  return (
    <section id="build-this" className="py-16" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[620px] px-6">
        <div
          className="rounded-[24px] p-7 sm:p-9"
          style={{ background: "var(--cream)", border: "1px solid var(--hair-strong)" }}
        >
          {phase === "cta" && (
            <div className="text-center">
              <h2 className="font-bold mb-2" style={{ fontSize: "24px", color: "var(--ink)" }}>
                Want this to exist?
              </h2>
              <p className="mb-6 text-[14px]" style={{ color: "var(--ink-soft)" }}>
                Raise your hand — takes 10 seconds, no commitment. We&apos;ll email you the moment it&apos;s ready.
              </p>
              <button
                type="button"
                onClick={() => setPhase("step1")}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl"
                style={{ background: "var(--ink)" }}
              >
                {ctaLabel} →
              </button>
            </div>
          )}

          {phase === "step1" && (
            <form onSubmit={submitLead} className="space-y-4">
              <h2 className="font-bold mb-1" style={{ fontSize: "20px", color: "var(--ink)" }}>
                {ctaLabel}
              </h2>
              <p className="text-[13px] mb-3" style={{ color: "var(--ink-soft)" }}>
                Just your email — we&apos;ll let you know the moment it launches.
              </p>

              <div>
                <label htmlFor="lead-email" className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="you@company.com"
                  style={fieldStyle}
                  {...leadForm.register("email")}
                />
                {leadForm.formState.errors.email && (
                  <p className="text-[12px] mt-1" style={{ color: "#DC2626" }}>
                    {leadForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lead-name" className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                  Name <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(optional)</span>
                </label>
                <input id="lead-name" type="text" placeholder="Jane Doe" style={fieldStyle} {...leadForm.register("name")} />
              </div>

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

              {serverError && (
                <p className="text-[12px]" style={{ color: "#DC2626" }}>
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={leadForm.formState.isSubmitting}
                className="w-full text-center py-3 text-[14px] font-semibold text-white rounded-xl disabled:opacity-60"
                style={{ background: "var(--ink)" }}
              >
                {leadForm.formState.isSubmitting ? "Sending…" : "Count me in"}
              </button>
            </form>
          )}

          {phase === "step1-done" && (
            <div className="text-center" role="status" aria-live="polite">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--ink)" }}>
                You&apos;re on the list 🎉
              </p>
              <p className="mb-6 text-[13px]" style={{ color: "var(--ink-soft)" }}>
                We&apos;ll email you the moment {toolName} is ready.
              </p>
              <div className="pt-5" style={{ borderTop: "1px solid var(--hair-strong)" }}>
                <p className="mb-3 text-[14px] font-medium" style={{ color: "var(--ink)" }}>
                  Got a minute? Help us build this right.
                </p>
                <button
                  type="button"
                  onClick={() => setPhase("step2")}
                  className="text-[13px] font-semibold px-5 py-2.5 rounded-full"
                  style={{ background: "var(--paper)", border: "1px solid var(--hair-strong)", color: "var(--ink)" }}
                >
                  Answer a few quick questions
                </button>
              </div>
            </div>
          )}

          {phase === "step2" && (
            <form onSubmit={submitSurvey} className="space-y-5">
              <h2 className="font-bold" style={{ fontSize: "18px", color: "var(--ink)" }}>
                A few quick questions
              </h2>

              <div>
                <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
                  Would you pay for this if it worked exactly as described?
                </p>
                <PillGroup
                  accent={accent}
                  value={surveyForm.watch("wouldPay")}
                  onChange={(v) => surveyForm.setValue("wouldPay", v as WouldPay, { shouldValidate: true })}
                  options={[
                    { value: "yes", label: "Yes, definitely" },
                    { value: "maybe", label: "Maybe, depends on price" },
                    { value: "no", label: "No" },
                  ]}
                />
                {surveyForm.formState.errors.wouldPay && (
                  <p className="text-[12px] mt-1" style={{ color: "#DC2626" }}>
                    Pick one
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="how-solve" className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                  How do you handle this today?
                </label>
                <textarea id="how-solve" rows={2} style={fieldStyle} {...surveyForm.register("howSolveToday")} />
                {surveyForm.formState.errors.howSolveToday && (
                  <p className="text-[12px] mt-1" style={{ color: "#DC2626" }}>
                    {surveyForm.formState.errors.howSolveToday.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="must-have" className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                  What would make this a must-have (not just nice-to-have) for you?
                </label>
                <textarea id="must-have" rows={2} style={fieldStyle} {...surveyForm.register("mustHaveReason")} />
                {surveyForm.formState.errors.mustHaveReason && (
                  <p className="text-[12px] mt-1" style={{ color: "#DC2626" }}>
                    {surveyForm.formState.errors.mustHaveReason.message}
                  </p>
                )}
              </div>

              {questions.map((q) => (
                <div key={q.key}>
                  <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    {q.label} {!q.required && <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(optional)</span>}
                  </p>
                  {q.type === "select" && q.options ? (
                    <>
                      <PillGroup
                        accent={accent}
                        value={toolAnswers[q.key]}
                        onChange={(v) => setToolAnswers((prev) => ({ ...prev, [q.key]: v }))}
                        options={q.options}
                      />
                      {q.allowOther && toolAnswers[q.key] === "other" && (
                        <input
                          type="text"
                          placeholder="Tell us more…"
                          className="mt-2"
                          style={fieldStyle}
                          onChange={(e) => setToolAnswers((prev) => ({ ...prev, [`${q.key}_other`]: e.target.value }))}
                        />
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      style={fieldStyle}
                      value={toolAnswers[q.key] ?? ""}
                      onChange={(e) => setToolAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="additional" className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                  Anything else you&apos;d want it to do? <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(optional)</span>
                </label>
                <textarea id="additional" rows={2} style={fieldStyle} {...surveyForm.register("additionalFeedback")} />
              </div>

              {(toolAnswerError || serverError) && (
                <p className="text-[12px]" style={{ color: "#DC2626" }}>
                  {toolAnswerError || serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={surveyForm.formState.isSubmitting}
                className="w-full text-center py-3 text-[14px] font-semibold text-white rounded-xl disabled:opacity-60"
                style={{ background: "var(--ink)" }}
              >
                {surveyForm.formState.isSubmitting ? "Sending…" : "Send my answers"}
              </button>
            </form>
          )}

          {phase === "done" && (
            <div className="text-center" role="status" aria-live="polite">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Thank you — this genuinely helps.
              </p>
              <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
                We read every answer. You&apos;ll hear from us as {toolName} takes shape.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
