import { Mail, Check, Loader2, ShieldCheck } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

export function SignSyncMockup({ accent }: { accent: string }) {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Mail style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>Deploy: Q3 rebrand template</span>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 9px",
              borderRadius: "9999px",
              background: "rgba(0,201,167,0.08)",
              color: "#007A66",
              border: "1px solid rgba(0,201,167,0.25)",
            }}
          >
            38/40 synced
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Deployed via Google Workspace Admin</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007A66" }}>
            <ShieldCheck style={{ width: "13px", height: "13px" }} />
            Never reads email content
          </span>
        </>
      }
    >
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ height: "8px", borderRadius: "9999px", background: "#F1F5F9", overflow: "hidden" }}>
          <div
            style={
              {
                height: "100%",
                borderRadius: "9999px",
                background: accent,
                animation: "labsBarGrow 3.5s ease-out both",
                "--bar-from": "6%",
                "--bar-to": "95%",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div style={{ padding: "8px 18px" }}>
        <MockupRow delay="0.1s">
          <span style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "#E2E8F0", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>Sales team · 12 people</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#059669" }}>
            <Check style={{ width: "12px", height: "12px" }} />
            Deployed
          </span>
        </MockupRow>
        <MockupRow delay="0.2s">
          <span style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "#E2E8F0", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>Support team · 18 people</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#059669" }}>
            <Check style={{ width: "12px", height: "12px" }} />
            Deployed
          </span>
        </MockupRow>
        <MockupRow delay="0.3s" noBorder>
          <span style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "#E2E8F0", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", flex: 1 }}>Leadership · 10 people</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "9999px",
              background: "rgba(245,158,11,0.08)",
              color: "#B45309",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <Loader2 style={{ width: "11px", height: "11px", animation: "labsSpinSlow 1s linear infinite" }} />
            Syncing…
          </span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
