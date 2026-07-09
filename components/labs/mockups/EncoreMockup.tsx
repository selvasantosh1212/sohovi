import { Calendar, Check, Receipt, Send } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function EncoreMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>Tuesday · 4 lessons</span>
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
              background: "rgba(245,158,11,0.08)",
              color: "#B45309",
              border: "1px solid rgba(245,158,11,0.25)",
              animation: "labsPulseRingAmber 2s ease-in-out infinite",
            }}
          >
            2 makeup credits owed
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Practice assignments auto-emailed after each lesson</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007A66" }}>
            <Send style={{ width: "13px", height: "13px", animation: "labsSendBob 1.4s ease-in-out infinite" }} />
            Sent to 3 parents
          </span>
        </>
      }
    >
      <div style={{ padding: "8px 18px" }}>
        <MockupRow delay="0.1s">
          <span style={{ ...mono, fontSize: "12.5px", color: "#475569", width: "62px" }}>3:30 PM</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>Maya R.</span>
          <span style={{ fontSize: "12.5px", color: "#64748B", flex: 1 }}>Piano · Grade 3</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#059669" }}>
            <Check style={{ width: "12px", height: "12px" }} />
            Attended
          </span>
        </MockupRow>
        <MockupRow delay="0.2s">
          <span style={{ ...mono, fontSize: "12.5px", color: "#475569", width: "62px" }}>4:15 PM</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>Leo T.</span>
          <span style={{ fontSize: "12.5px", color: "#64748B", flex: 1 }}>Guitar · Beginner</span>
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
            Makeup credit
          </span>
        </MockupRow>
        <MockupRow delay="0.3s" noBorder>
          <span style={{ ...mono, fontSize: "12.5px", color: "#475569", width: "62px" }}>5:00 PM</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>Ava S.</span>
          <span style={{ fontSize: "12.5px", color: "#64748B", flex: 1 }}>Voice · Grade 5</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#059669" }}>
            <Receipt style={{ width: "12px", height: "12px" }} />
            Invoice paid
          </span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
