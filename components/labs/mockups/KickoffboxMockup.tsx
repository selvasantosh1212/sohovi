import { FolderKanban, CheckCircle2, AlertTriangle, MailCheck } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function KickoffboxMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FolderKanban style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>Acme Website Redesign</span>
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
              62% complete
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748B" }}>3 items left</span>
        </>
      }
      footer={
        <>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B" }}>
            <MailCheck style={{ width: "13px", height: "13px" }} />
            One digest email, not five
          </span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#007A66" }}>Client viewed 10 min ago</span>
        </>
      }
    >
      <div style={{ padding: "10px 18px 0" }}>
        <div style={{ height: "4px", borderRadius: "9999px", background: "#F1F5F9", overflow: "hidden" }}>
          <div
            style={
              {
                height: "100%",
                borderRadius: "9999px",
                background: "#00C9A7",
                animation: "labsBarGrow 8s ease-in-out infinite alternate",
                "--bar-from": "18%",
                "--bar-to": "62%",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div style={{ padding: "8px 18px" }}>
        <MockupRow delay="0.1s">
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Logo &amp; brand files</span>
          <span style={{ fontSize: "12px", color: "#94A3B8" }}>Uploaded</span>
        </MockupRow>
        <MockupRow delay="0.2s">
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Homepage copy</span>
          <span style={{ fontSize: "12px", color: "#94A3B8" }}>Uploaded</span>
        </MockupRow>
        <MockupRow delay="0.3s" noBorder>
          <AlertTriangle style={{ width: "16px", height: "16px", color: "#F59E0B", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Hosting login — 2 of 3 fields</span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "9999px",
              background: "rgba(245,158,11,0.08)",
              color: "#B45309",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            Nudged
          </span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
