import { ImageIcon, Eye, TrendingUp, Scissors } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function ThumblabMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ImageIcon style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>3 variants ready</span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Generated in 41s</span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Predicted CTR vs. your last 10 uploads</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#B02333" }}>
            <TrendingUp style={{ width: "13px", height: "13px" }} />
            +18%
          </span>
        </>
      }
    >
      <div style={{ padding: "14px 18px 6px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {[
          { label: "A", score: "82", active: true },
          { label: "B", score: "67", active: false },
          { label: "C", score: "54", active: false },
        ].map((v) => (
          <div
            key={v.label}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: v.active ? "2px solid #E63946" : "1px solid #E2E8F0",
              animation: "labsFadeUp 0.5s ease both",
            }}
          >
            <div
              style={{
                aspectRatio: "16/9",
                background: v.active
                  ? "linear-gradient(135deg, #FCA5A5, #E63946)"
                  : "linear-gradient(135deg, #E2E8F0, #CBD5E1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ ...mono, fontSize: "11px", fontWeight: 700, color: "#FFFFFF" }}>{v.label}</span>
            </div>
            <div style={{ padding: "5px 7px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC" }}>
              <span style={{ fontSize: "10.5px", color: "#64748B" }}>Score</span>
              <span style={{ ...mono, fontSize: "10.5px", fontWeight: 700, color: v.active ? "#B02333" : "#94A3B8" }}>{v.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 18px 8px" }}>
        <MockupRow delay="0.1s">
          <Eye style={{ width: "16px", height: "16px", color: "#B02333", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Variant A previewed next to 6 competitor uploads</span>
        </MockupRow>
        <MockupRow delay="0.2s" noBorder>
          <Scissors style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>4 vertical clips auto-cropped with captions</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
