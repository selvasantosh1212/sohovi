import Link from "next/link";
import { darkenColor } from "@/lib/labs/color";

interface LabsHeaderProps {
  accent: string;
  honestyStripText?: string;
}

export function LabsHeader({ accent, honestyStripText }: LabsHeaderProps) {
  const accentDark = darkenColor(accent);

  return (
    <>
      <div
        style={{
          background: "#1A1A2E",
          color: "rgba(255,255,255,0.85)",
          fontSize: "12.5px",
          textAlign: "center",
          padding: "8px 24px",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "#FFFFFF" }}>This tool isn&apos;t built yet.</strong>{" "}
        {honestyStripText ??
          "This page validates demand — if enough people raise a hand, we build it and email you first."}
      </div>

      <header
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="https://sohovi.com" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "-0.02em", color: "#1A1A2E" }}>
              sohovi
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                padding: "3px 9px",
                borderRadius: "9999px",
                background: "rgba(0,201,167,0.08)",
                color: "#007A66",
                border: "1px solid rgba(0,201,167,0.25)",
              }}
            >
              Labs
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="#how-it-works" className="labs-nav-link" style={{ fontSize: "13.5px", fontWeight: 500, color: "#475569" }}>
              How It Works
            </a>
            <a href="#pricing" className="labs-nav-link" style={{ fontSize: "13.5px", fontWeight: 500, color: "#475569" }}>
              Pricing
            </a>
            <a
              href="#build-this"
              className="labs-cta-btn"
              style={
                {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: accent,
                  borderRadius: "8px",
                  transition: "background-color 150ms",
                  "--hover-bg": accentDark,
                } as React.CSSProperties
              }
            >
              Join the List →
            </a>
          </div>
        </div>
      </header>
      <style>{`
        .labs-nav-link:hover { color: #1A1A2E; }
        .labs-cta-btn:hover { background: var(--hover-bg) !important; }
      `}</style>
    </>
  );
}
