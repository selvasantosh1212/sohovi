import { Check } from "lucide-react";
import { tintColor } from "@/lib/labs/color";

interface CompareRow {
  feature: string;
  us: string;
  them: string;
}

interface ComparisonSectionProps {
  toolName: string;
  headline: string;
  intro: string;
  competitorLabel: string;
  accent: string;
  rows: CompareRow[];
  note?: string;
}

export function ComparisonSection({ toolName, headline, intro, competitorLabel, accent, rows, note }: ComparisonSectionProps) {
  const accentTint = tintColor(accent);
  return (
    <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "88px 0" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
          How it compares
        </p>
        <h2 style={{ margin: "0 0 12px", fontWeight: 700, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.12, color: "#1A1A2E" }}>
          {headline}
        </h2>
        <p style={{ margin: "0 0 36px", fontSize: "16px", lineHeight: 1.6, color: "#64748B", maxWidth: "58ch" }}>{intro}</p>
        <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid #E2E8F0", background: "#FFFFFF", boxShadow: "0 1px 2px rgba(26,26,46,0.04)" }}>
          <div style={{ minWidth: "600px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr" }}>
              <div style={{ padding: "18px 20px" }} />
              <div
                style={{
                  padding: "18px 20px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#1A1A2E",
                  background: accentTint,
                  borderLeft: "1px solid #E2E8F0",
                  borderRight: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: accent }} />
                {toolName}
              </div>
              <div style={{ padding: "18px 20px", fontSize: "13.5px", fontWeight: 600, color: "#64748B" }}>{competitorLabel}</div>
            </div>
            {rows.map((row) => (
              <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ padding: "16px 20px", fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>{row.feature}</div>
                <div
                  style={{
                    padding: "16px 20px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#1A1A2E",
                    background: accentTint,
                    borderLeft: "1px solid #E2E8F0",
                    borderRight: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <Check style={{ width: "14px", height: "14px", color: accent, flexShrink: 0, marginTop: "2px" }} />
                  {row.us}
                </div>
                <div style={{ padding: "16px 20px", fontSize: "13.5px", color: "#64748B" }}>{row.them}</div>
              </div>
            ))}
          </div>
        </div>
        {note && <p style={{ margin: "18px 0 0", fontSize: "13px", color: "#64748B" }}>{note}</p>}
      </div>
    </section>
  );
}
