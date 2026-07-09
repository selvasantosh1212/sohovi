import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  badge?: string; // e.g. "Most Popular" or "One Plan"
}

interface PricingPreviewProps {
  headline?: string;
  intro: string;
  accent: string;
  plans: PricingPlan[];
  footnote?: string;
}

function PlanCard({ plan, accent }: { plan: PricingPlan; accent: string }) {
  const dark = !!plan.highlight;
  return (
    <div
      style={{
        borderRadius: "16px",
        padding: dark ? "30px" : "26px",
        display: "flex",
        flexDirection: "column",
        background: dark ? "#1A1A2E" : "#FFFFFF",
        border: dark ? "1px solid #1A1A2E" : "1px solid #E2E8F0",
        boxShadow: dark ? "0 8px 30px rgba(26,26,46,0.18)" : "0 1px 2px rgba(26,26,46,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: dark ? "#FFFFFF" : "#1A1A2E" }}>{plan.name}</p>
        {plan.badge && (
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "3px 10px",
              borderRadius: "9999px",
              background: accent,
              color: "#FFFFFF",
            }}
          >
            {plan.badge}
          </span>
        )}
      </div>
      <p style={{ margin: "0 0 4px" }}>
        <span style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em", color: dark ? "#FFFFFF" : "#1A1A2E" }}>{plan.price}</span>
        {plan.period && (
          <span style={{ fontSize: "13px", marginLeft: "4px", color: dark ? "rgba(255,255,255,0.55)" : "#64748B" }}>{plan.period}</span>
        )}
      </p>
      <p style={{ margin: "0 0 18px", fontSize: "12.5px", color: dark ? "rgba(255,255,255,0.55)" : "#64748B" }}>{plan.tagline}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13.5px", color: dark ? "rgba(255,255,255,0.85)" : "#475569" }}>
            <Check style={{ width: "14px", height: "14px", flexShrink: 0, marginTop: "2px", color: "#00C9A7" }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingPreview({ intro, accent, plans, footnote }: PricingPreviewProps) {
  const maxWidth = plans.length >= 3 ? "880px" : "640px";
  const gridClass = plans.length === 3 ? "labs-pricing-3" : plans.length === 2 ? "labs-pricing-2" : "";

  return (
    <section id="pricing" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", padding: "88px 0" }}>
      <div style={{ maxWidth, margin: "0 auto", padding: "0 24px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
          Planned pricing
        </p>
        <h2 style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.12, color: "#1A1A2E" }}>
          Simple, honest pricing
        </h2>
        <p style={{ margin: "0 0 40px", fontSize: "15px", color: "#64748B" }}>{intro}</p>

        {plans.length === 1 ? (
          <PlanCard plan={plans[0]} accent={accent} />
        ) : (
          <div className={gridClass} style={{ display: "grid", gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: "20px", alignItems: "stretch" }}>
            {plans.map((p) => (
              <PlanCard key={p.name} plan={p} accent={accent} />
            ))}
          </div>
        )}

        {footnote && (
          <p style={{ margin: "24px 0 0", fontSize: "13px", color: "#64748B", maxWidth: "60ch" }}>{footnote}</p>
        )}
      </div>
      <style>{`@media (max-width: 640px) { .labs-pricing-3, .labs-pricing-2 { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
