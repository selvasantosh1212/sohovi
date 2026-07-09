import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface SolutionSectionProps {
  headline: string;
  intro: string;
  accent: string;
  features: Feature[];
}

export function SolutionSection({ headline, intro, accent, features }: SolutionSectionProps) {
  return (
    <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", padding: "88px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
          What we&apos;d build
        </p>
        <h2
          style={{
            margin: "0 0 12px",
            fontWeight: 700,
            fontSize: "clamp(28px, 3.6vw, 40px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "#1A1A2E",
            maxWidth: "24ch",
          }}
        >
          {headline}
        </h2>
        <p style={{ margin: "0 0 48px", fontSize: "16px", lineHeight: 1.6, color: "#64748B", maxWidth: "58ch" }}>{intro}</p>
        <div className="labs-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ border: "1px solid #E2E8F0", borderRadius: "14px", padding: "22px" }}>
                <Icon style={{ width: "20px", height: "20px", color: "#00C9A7", marginBottom: "14px" }} />
                <h3 style={{ margin: "0 0 6px", fontSize: "15.5px", fontWeight: 700, color: "#1A1A2E" }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6, color: "#64748B" }}>{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .labs-3col { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
