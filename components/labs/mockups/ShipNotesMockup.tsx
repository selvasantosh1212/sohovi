import { Megaphone, Code2 } from "lucide-react";
import { HeroMockupCard } from "@/components/labs/HeroMockupCard";

export function ShipNotesMockup({ accent }: { accent: string }) {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Megaphone style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A2E" }}>What&apos;s new</span>
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
            3 unread
          </span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Emailed to 312 subscribers on publish</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#007A66" }}>
            <Code2 style={{ width: "13px", height: "13px" }} />
            &lt;5KB embed
          </span>
        </>
      }
    >
      <div style={{ padding: "8px 18px" }}>
        <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9", animation: "labsFadeUp 0.5s ease both", animationDelay: "0.1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: accent, flexShrink: 0, animation: "labsPulseDot 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>Bulk export to CSV</span>
            <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: "auto" }}>2d ago</span>
          </div>
          <p style={{ margin: "0 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>Draft from PR #248 — humanized in 30 seconds</p>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9", animation: "labsFadeUp 0.5s ease both", animationDelay: "0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                background: accent,
                flexShrink: 0,
                animation: "labsPulseDot 1.8s ease-in-out infinite",
                animationDelay: "0.3s",
              }}
            />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>Dark mode</span>
            <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: "auto" }}>6d ago</span>
          </div>
          <p style={{ margin: "0 0 0 14px", fontSize: "12.5px", color: "#64748B" }}>Draft from PR #241 — humanized in 30 seconds</p>
        </div>
        <div style={{ padding: "12px 0", animation: "labsFadeUp 0.5s ease both", animationDelay: "0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#E2E8F0", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>API rate limit increase</span>
            <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: "auto" }}>2w ago</span>
          </div>
        </div>
      </div>
    </HeroMockupCard>
  );
}
