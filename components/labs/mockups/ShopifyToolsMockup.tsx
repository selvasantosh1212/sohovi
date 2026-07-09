import { Tag, Undo2 } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function ShopifyToolsMockup({ accent }: { accent: string }) {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Tag style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>Summer Sale · 214 variants</span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 9px",
              borderRadius: "9999px",
              background: "rgba(245,158,11,0.08)",
              color: "#B45309",
              border: "1px solid rgba(245,158,11,0.25)",
              animation: "labsPulseRingAmber 2s ease-in-out infinite",
            }}
          >
            Scheduled
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Auto-reverts to original prices Jul 14, 12:00 AM</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007A66" }}>
            <Undo2 style={{ width: "13px", height: "13px" }} />
            Rollback ready
          </span>
        </>
      }
    >
      <div style={{ padding: "10px 18px 0" }}>
        <div style={{ height: "4px", borderRadius: "9999px", background: "#F1F5F9", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "9999px", background: accent, animation: "labsBarShrink 9s linear infinite" }} />
        </div>
      </div>
      <div style={{ padding: "8px 18px" }}>
        <MockupRow delay="0.1s">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>Classic Tee — S/M/L</span>
          <span style={{ ...mono, fontSize: "12.5px", color: "#94A3B8", textDecoration: "line-through" }}>$28.00</span>
          <span style={{ ...mono, fontSize: "12.5px", fontWeight: 600, color: "#059669" }}>$19.60</span>
        </MockupRow>
        <MockupRow delay="0.2s">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>Canvas Tote</span>
          <span style={{ ...mono, fontSize: "12.5px", color: "#94A3B8", textDecoration: "line-through" }}>$34.00</span>
          <span style={{ ...mono, fontSize: "12.5px", fontWeight: 600, color: "#059669" }}>$23.80</span>
        </MockupRow>
        <MockupRow delay="0.3s" noBorder>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>+ 212 more variants</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: accent }}>30% off</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
