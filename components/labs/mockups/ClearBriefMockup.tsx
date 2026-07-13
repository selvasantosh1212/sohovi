import { ClipboardCheck, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function ClearBriefMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ClipboardCheck style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>Podcast Edit Brief</span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748B" }}>7 of 9 complete</span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Reminder sent to client 2h ago</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#A21CAF" }}>
            <Sparkles style={{ width: "13px", height: "13px" }} />
            AI-checked
          </span>
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
                background: "#C026D3",
                animation: "labsBarGrow 8s ease-in-out infinite alternate",
                "--bar-from": "20%",
                "--bar-to": "78%",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ border: "1px solid rgba(192,38,212,0.3)", borderRadius: "12px", padding: "14px", background: "rgba(192,38,212,0.05)", marginBottom: "12px", animation: "labsFadeUp 0.5s ease both" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <AlertTriangle style={{ width: "16px", height: "16px", color: "#A21CAF", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ margin: 0, fontSize: "12.5px", color: "#1A1A2E", lineHeight: 1.5 }}>
              <strong>Ambiguity flagged:</strong> client didn&apos;t specify target episode length
            </p>
          </div>
        </div>
        <MockupRow delay="0.1s">
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Raw audio files — uploaded</span>
        </MockupRow>
        <MockupRow delay="0.2s" noBorder>
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Intro/outro music — uploaded</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
