import type { LucideIcon } from "lucide-react";

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

interface HowItWorksSectionProps {
  headline: string;
  intro: string;
  accent: string;
  steps: Step[];
}

export function HowItWorksSection({ headline, intro, accent, steps }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", padding: "88px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
          How it works
        </p>
        <h2
          style={{
            margin: "0 0 12px",
            fontWeight: 700,
            fontSize: "clamp(28px, 3.6vw, 40px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "#1A1A2E",
            maxWidth: "22ch",
          }}
        >
          {headline}
        </h2>
        <p style={{ margin: "0 0 48px", fontSize: "16px", lineHeight: 1.6, color: "#64748B", maxWidth: "58ch" }}>{intro}</p>
        <div className="labs-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", fontWeight: 600, color: accent }}>{step.num}</span>
                  <span style={{ height: "1px", flex: 1, background: "#E2E8F0" }} />
                  <Icon style={{ width: "20px", height: "20px", color: "#1A1A2E" }} />
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.6, color: "#64748B" }}>{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .labs-3col { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
