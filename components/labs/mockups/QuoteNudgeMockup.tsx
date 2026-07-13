import { MessageCircle, Eye, CheckCircle2, Wallet } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function QuoteNudgeMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MessageCircle style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>Quote #0142</span>
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
              background: "rgba(16,185,129,0.08)",
              color: "#047857",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <Eye style={{ width: "11px", height: "11px" }} />
            Viewed 2m ago
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Sent via WhatsApp</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#92400E" }}>
            <Wallet style={{ width: "13px", height: "13px" }} />
            Total $840.00
          </span>
        </>
      }
    >
      <div style={{ padding: "16px 18px" }}>
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "14px", background: "#F8FAFC", marginBottom: "12px", animation: "labsFadeUp 0.5s ease both" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: "#1A1A2E" }}>Kitchen sink repair — Maple St.</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>
            <span>Labor (2.5 hrs)</span>
            <span style={mono}>$225.00</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B" }}>
            <span>Materials — P-trap, fittings</span>
            <span style={mono}>$615.00</span>
          </div>
        </div>
        <MockupRow delay="0.1s">
          <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Client viewed the quote at 2:14 PM</span>
        </MockupRow>
        <MockupRow delay="0.2s" noBorder>
          <MessageCircle style={{ width: "16px", height: "16px", color: "#B45309", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Follow-up scheduled for tomorrow, 9 AM</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
