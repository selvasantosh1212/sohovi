import type { LucideIcon } from "lucide-react";

interface Pain {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface PainPointSectionProps {
  headline: string;
  intro: string;
  accent: string;
  pains: Pain[];
}

export function PainPointSection({ headline, intro, accent, pains }: PainPointSectionProps) {
  return (
    <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "88px 0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div className="labs-problem-grid" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "56px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: "96px" }}>
            <p style={{ margin: "0 0 14px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accent }}>
              The problem
            </p>
            <h2 style={{ margin: "0 0 14px", fontWeight: 700, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", lineHeight: 1.12, color: "#1A1A2E" }}>
              {headline}
            </h2>
            <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.65, color: "#64748B", textWrap: "pretty" } as React.CSSProperties}>{intro}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {pains.map((pain) => {
              const Icon = pain.icon;
              return (
                <div
                  key={pain.title}
                  className="labs-pain-card"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    gap: "18px",
                    alignItems: "flex-start",
                    boxShadow: "0 1px 2px rgba(26,26,46,0.04)",
                    transition: "box-shadow 150ms",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <Icon style={{ width: "18px", height: "18px", color: "#EF4444" }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontSize: "16.5px", fontWeight: 700, color: "#1A1A2E" }}>{pain.title}</h3>
                    <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.6, color: "#64748B" }}>{pain.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .labs-pain-card:hover { box-shadow: 0 4px 12px rgba(26,26,46,0.08); }
        @media (max-width: 860px) { .labs-problem-grid { grid-template-columns: 1fr !important; } .labs-problem-grid > div:first-child { position: static !important; } }
      `}</style>
    </section>
  );
}
