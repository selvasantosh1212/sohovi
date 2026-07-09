import type { ReactNode } from "react";

interface HeroMockupCardProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

/** Shared white-card chrome for the per-product animated hero mockups — header row, free-form body, footer row. */
export function HeroMockupCard({ header, footer, children }: HeroMockupCardProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(26,26,46,0.08)",
        overflow: "hidden",
        animation: "labsFadeUp 0.6s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {header}
      </div>
      {children}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderTop: "1px solid #E2E8F0",
          background: "#F8FAFC",
        }}
      >
        {footer}
      </div>
    </div>
  );
}

export function MockupRow({
  children,
  delay,
  noBorder,
}: {
  children: ReactNode;
  delay: "0.1s" | "0.2s" | "0.3s";
  noBorder?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 0",
        borderBottom: noBorder ? undefined : "1px solid #F1F5F9",
        animation: "labsFadeUp 0.5s ease both",
        animationDelay: delay,
      }}
    >
      {children}
    </div>
  );
}
