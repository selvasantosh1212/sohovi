import { Users, Download } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function RefTrackMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Users style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>Affiliates · 12 active</span>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 9px",
              borderRadius: "9999px",
              background: "rgba(0,201,167,0.08)",
              color: "#007A66",
              border: "1px solid rgba(0,201,167,0.25)",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#00C9A7", animation: "labsPulseRingTeal 2s ease-in-out infinite" }} />
            $1,240 owed this month
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Synced live from Stripe webhooks</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007A66" }}>
            <Download style={{ width: "13px", height: "13px" }} />
            CSV payout ready
          </span>
        </>
      }
    >
      <div style={{ padding: "8px 18px" }}>
        <MockupRow delay="0.1s">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>@dana_builds</span>
          <span style={{ fontSize: "12.5px", color: "#64748B" }}>14 clicks</span>
          <span style={{ ...mono, fontSize: "12.5px", fontWeight: 600, color: "#059669" }}>$420</span>
        </MockupRow>
        <MockupRow delay="0.2s">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>@saas_sam</span>
          <span style={{ fontSize: "12.5px", color: "#64748B" }}>9 clicks</span>
          <span style={{ ...mono, fontSize: "12.5px", fontWeight: 600, color: "#059669" }}>$280</span>
        </MockupRow>
        <MockupRow delay="0.3s" noBorder>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>@indiehacker_lee</span>
          <span style={{ fontSize: "12.5px", color: "#64748B" }}>6 clicks</span>
          <span style={{ ...mono, fontSize: "12.5px", fontWeight: 600, color: "#059669" }}>$180</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
