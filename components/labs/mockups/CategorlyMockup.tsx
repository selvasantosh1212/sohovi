import { Landmark, CheckCircle2, Clock3, BellRing } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function CategorlyMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Landmark style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>Acme Bakery LLC</span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Month-end: Jan close</span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>12 of 15 transactions categorized</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#3730A3" }}>
            <BellRing style={{ width: "13px", height: "13px" }} />
            Reminder sent
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
                background: "#4338CA",
                animation: "labsBarGrow 8s ease-in-out infinite alternate",
                "--bar-from": "10%",
                "--bar-to": "80%",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "16px",
            background: "#F8FAFC",
            marginBottom: "12px",
            animation: "labsFadeUp 0.5s ease both",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: "11.5px", color: "#64748B" }}>What was this charge?</p>
          <p style={{ margin: "0 0 12px", ...mono, fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>$45.00 — Staples #4471</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "8px", background: "#4338CA", color: "#FFFFFF", fontSize: "12.5px", fontWeight: 600 }}>Office Supplies</span>
            <span style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "8px", background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#64748B", fontSize: "12.5px", fontWeight: 600 }}>Other</span>
          </div>
        </div>
        <MockupRow delay="0.1s">
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>$212 — Sysco Foods → Cost of Goods</span>
        </MockupRow>
        <MockupRow delay="0.2s" noBorder>
          <Clock3 style={{ width: "16px", height: "16px", color: "#F59E0B", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>2 more waiting on client</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
