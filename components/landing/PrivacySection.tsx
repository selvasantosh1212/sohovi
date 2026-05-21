import { ServerOff, HardDrive, ShieldCheck, Globe, Lock, Eye } from "lucide-react";

const trustItems = [
  {
    icon: ServerOff,
    title: "No Server Upload",
    body: "Raw data never leaves your machine. File reading happens entirely via the browser File API.",
  },
  {
    icon: HardDrive,
    title: "Client-Side Processing",
    body: "All computation — profiling, scoring, rule evaluation — runs in Web Workers inside your browser tab.",
  },
  {
    icon: ShieldCheck,
    title: "No Cloud Storage",
    body: "Your rows are never written to any database. Only DQ scores and rule metadata are stored.",
  },
  {
    icon: Globe,
    title: "GDPR-Friendly by Design",
    body: "No PII is transmitted. No consent is required for the processing layer.",
  },
  {
    icon: Lock,
    title: "Zero Breach Risk",
    body: "There is nothing on our servers to breach. Your data exists only in your browser session.",
  },
  {
    icon: Eye,
    title: "PII Detection Built In",
    body: "Identify sensitive columns — emails, phones, SSNs — before you share results with anyone.",
  },
];

const architectureSteps = [
  "You select a file from your device",
  "Sohovi reads it using the browser File API — no network request",
  "All processing runs in a Web Worker — isolated, off the main thread",
  "Only DQ scores, rule metadata, and aggregated summaries are ever stored",
];

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24" style={{ background: "var(--ink)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--terracotta)" }}>
            Privacy Architecture
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "var(--cream)" }}
          >
            Your data{" "}
            <em className="serif-accent" style={{ color: "var(--butter)" }}>never</em>
            {" "}leaves your browser.<br className="hidden sm:block" /> That&apos;s the architecture.
          </h2>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "rgba(251,247,242,0.6)" }}>
            This isn&apos;t a marketing tagline — it&apos;s how the product is engineered. All file reading, profiling, and scoring runs inside Web Workers in your browser tab.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Architecture steps */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(251,247,242,0.4)" }}>How it actually works</h3>
            <ol className="space-y-5">
              {architectureSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "var(--terracotta)" }}
                  >
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed" style={{ color: "rgba(251,247,242,0.75)" }}>{step}</p>
                </li>
              ))}
            </ol>

            {/* Skeptic callout */}
            <div className="mt-8 rounded-[20px] p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(251,247,242,0.65)" }}>
                <strong style={{ color: "var(--cream)" }}>Don&apos;t take our word for it.</strong> Open DevTools → Network tab while running an analysis. You&apos;ll see zero outbound requests for your data.
              </p>
            </div>
          </div>

          {/* Trust grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[20px] p-5 space-y-3 transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(224,113,80,0.2)" }}>
                    <Icon className="w-4 h-4" style={{ color: "var(--terracotta)" }} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm" style={{ color: "var(--cream)" }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(251,247,242,0.55)" }}>{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
