import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { darkenColor } from "@/lib/labs/color";

interface TrustBullet {
  icon: LucideIcon;
  text: string;
}

interface LabsHeroProps {
  eyebrowIcon: LucideIcon;
  eyebrowText: string;
  headline: ReactNode;
  subheadline: ReactNode;
  ctaLabel: string;
  accent: string;
  trustBullets: TrustBullet[];
  mockup: ReactNode;
}

export function LabsHero({ eyebrowIcon: EyebrowIcon, eyebrowText, headline, subheadline, ctaLabel, accent, trustBullets, mockup }: LabsHeroProps) {
  const accentDark = darkenColor(accent);
  return (
    <section style={{ background: "#F8FAFC", padding: "72px 0 80px" }}>
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "56px",
          alignItems: "center",
        }}
        className="labs-hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "22px",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              color: "#475569",
            }}
          >
            <EyebrowIcon style={{ width: "14px", height: "14px", color: "#00C9A7" }} />
            {eyebrowText}
          </div>

          <h1
            style={
              {
                margin: 0,
                fontWeight: 800,
                lineHeight: 1.06,
                fontSize: "clamp(36px, 4.6vw, 58px)",
                letterSpacing: "-0.03em",
                color: "#1A1A2E",
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            {headline}
          </h1>

          <p
            style={
              {
                margin: "22px 0 0",
                fontSize: "17.5px",
                lineHeight: 1.6,
                color: "#475569",
                maxWidth: "480px",
                textWrap: "pretty",
              } as React.CSSProperties
            }
          >
            {subheadline}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "30px", flexWrap: "wrap" }}>
            <a
              href="#build-this"
              className="labs-cta-btn"
              style={
                {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 26px",
                  fontSize: "15.5px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: accent,
                  borderRadius: "8px",
                  transition: "background-color 150ms",
                  "--hover-bg": accentDark,
                } as React.CSSProperties
              }
            >
              {ctaLabel} →
            </a>
            <a
              href="#how-it-works"
              className="labs-secondary-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 26px",
                fontSize: "15.5px",
                fontWeight: 600,
                color: "#1A1A2E",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                transition: "background-color 150ms",
              }}
            >
              See How It Works
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "22px", fontSize: "13px", color: "#64748B", flexWrap: "wrap" }}>
            {trustBullets.map((b, i) => {
              const Icon = b.icon;
              return (
                <span key={b.text} style={{ display: "contents" }}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Icon style={{ width: "14px", height: "14px", color: "#00C9A7" }} />
                    {b.text}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {mockup}
      </div>
      <style>{`
        .labs-cta-btn:hover { background: var(--hover-bg) !important; }
        .labs-secondary-btn:hover { background: #F1F5F9 !important; }
        @media (max-width: 860px) {
          .labs-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
