import { Bot, TrendingUp, Quote, CircleCheck } from "lucide-react";
import { HeroMockupCard, MockupRow } from "@/components/labs/HeroMockupCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-geist-mono)" };

export function SeenlyMockup() {
  return (
    <HeroMockupCard
      header={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bot style={{ width: "16px", height: "16px", color: "#1A1A2E" }} />
            <span style={{ ...mono, fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>Weekly scan</span>
          </div>
          <span style={{ fontSize: "12px", color: "#64748B" }}>18 prompts · 3 engines</span>
        </>
      }
      footer={
        <>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Mention rate vs. last week</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#6D28D9" }}>
            <TrendingUp style={{ width: "13px", height: "13px" }} />
            +9%
          </span>
        </>
      }
    >
      <div style={{ padding: "14px 18px 6px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {[
          { label: "ChatGPT", pct: 62 },
          { label: "Perplexity", pct: 41 },
          { label: "AI Overviews", pct: 28 },
        ].map((e) => (
          <div key={e.label} style={{ textAlign: "center" }}>
            <div style={{ position: "relative", height: "44px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div
                style={{
                  width: "26px",
                  borderRadius: "6px 6px 0 0",
                  background: "#7C3AED",
                  height: `${e.pct}%`,
                  animation: "labsFadeUp 0.6s ease both",
                }}
              />
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "10.5px", fontWeight: 600, color: "#1A1A2E" }}>{e.label}</p>
            <p style={{ margin: 0, ...mono, fontSize: "10.5px", color: "#64748B" }}>{e.pct}%</p>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 18px 8px" }}>
        <MockupRow delay="0.1s">
          <CircleCheck style={{ width: "16px", height: "16px", color: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Mentioned in 11 of 18 tracked prompts</span>
        </MockupRow>
        <MockupRow delay="0.2s" noBorder>
          <Quote style={{ width: "16px", height: "16px", color: "#6D28D9", flexShrink: 0 }} />
          <span style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>Top cited source: your pricing page</span>
        </MockupRow>
      </div>
    </HeroMockupCard>
  );
}
