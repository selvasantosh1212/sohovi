/* ============================================================
   Sohovi App UI Kit — Primitives.jsx
   Shared building blocks: Icon, Card, Button, Chip, score
   widgets (badge / bar / gauge / dimension bars), glow helpers.
   Electric-Data dark theme. Exported to window.
   ============================================================ */

const { useState, useEffect, useRef, useLayoutEffect } = React;

/* Render Lucide icons WITHOUT letting the library mutate React-managed
   DOM. Each icon lives inside a ref'd <span> whose innerHTML we set
   imperatively — React never reconciles its children, so sibling style
   updates (e.g. active nav state) commit correctly. */
function useLucide(dep) {
  useLayoutEffect(() => {
    if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
  });
}

/* Whether the active theme wants glow (dark) or flat (light). Read once
   from the --theme-glow token set by the stylesheet. */
let _glow = null;
function glowOn() {
  if (_glow === null) {
    try { _glow = getComputedStyle(document.documentElement).getPropertyValue("--theme-glow").trim() === "1"; }
    catch (e) { _glow = false; }
  }
  return _glow;
}

function Icon({ name, size = 18, color, strokeWidth = 2, style, className }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    try { window.lucide.createIcons({ attrs: { "stroke-width": strokeWidth }, nameAttr: "data-lucide" }); } catch (e) {}
  }, [name, strokeWidth]);
  return (
    <span
      ref={ref}
      className={"ds-ico " + (className || "")}
      style={{ width: size, height: size, color, display: "inline-flex", flexShrink: 0, ...style }}
    />
  );
}

/* ---- DQ score helpers ---- */
function scoreState(s) {
  if (s == null) return { key: "none", color: "var(--text-mute)", soft: "rgba(107,119,148,.16)", label: "No data" };
  if (s >= 95) return { key: "high", color: "var(--score-high)", soft: "var(--score-high-soft)", label: "Excellent" };
  if (s >= 80) return { key: "good", color: "var(--score-good)", soft: "var(--score-good-soft)", label: "Good" };
  if (s >= 60) return { key: "warn", color: "var(--score-warn)", soft: "var(--score-warn-soft)", label: "Warning" };
  return { key: "danger", color: "var(--score-danger)", soft: "var(--score-danger-soft)", label: "Critical" };
}

/* ---- Card ---- */
function Card({ children, style, glow, className, onClick, hover }) {
  return (
    <div
      onClick={onClick}
      className={"sv-card" + (hover ? " sv-card--hover" : "") + (className ? " " + className : "")}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        boxShadow: glow ? "var(--glow-blue-soft), var(--shadow-card)" : "var(--shadow-card)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Button ---- */
function Button({ children, variant = "primary", size = "md", icon, iconRight, onClick, style, full }) {
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 13 },
    md: { padding: "10px 18px", fontSize: 14 },
    lg: { padding: "13px 24px", fontSize: 15 },
  };
  return (
    <button
      onClick={onClick}
      className={"sv-btn sv-btn--" + variant}
      style={{ ...sizes[size], width: full ? "100%" : "auto", ...style }}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 17 : 15} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 17 : 15} />}
    </button>
  );
}

/* ---- Chip / tag ---- */
function Chip({ children, tone = "neutral", style }) {
  const tones = {
    neutral: { background: "var(--surface-2)", color: "var(--text-soft)", border: "1px solid var(--line)" },
    blue: { background: "var(--blue-soft)", color: "var(--blue-bright)", border: "1px solid rgba(45,127,249,.3)" },
    green: { background: "var(--green-soft)", color: "var(--green-bright)", border: "1px solid rgba(34,229,134,.3)" },
    mono: { background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--line)", fontFamily: "var(--font-mono)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
      padding: "4px 10px", borderRadius: "var(--radius-pill)", ...tones[tone], ...style,
    }}>{children}</span>
  );
}

/* ---- Score badge ---- */
function ScoreBadge({ score, size = "md" }) {
  const st = scoreState(score);
  const pad = size === "sm" ? "2px 9px" : "3px 11px";
  const fs = size === "sm" ? 12 : 13;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", fontFamily: "var(--font-mono)", fontWeight: 600,
      fontSize: fs, padding: pad, borderRadius: "var(--radius-pill)",
      background: st.soft, color: st.color, border: `1px solid ${st.color}33`,
    }}>{score != null ? score : "—"}</span>
  );
}

/* ---- Score bar ---- */
function ScoreBar({ score, animate = true, height = 6 }) {
  const st = scoreState(score);
  const [w, setW] = useState(animate ? 0 : score);
  useEffect(() => { const t = setTimeout(() => setW(score), 60); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ width: "100%", height, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${w}%`, background: st.color, borderRadius: 999,
        boxShadow: glowOn() ? `0 0 12px -2px ${st.color}` : "none",
        transition: "width .9s cubic-bezier(.2,.8,.2,1)",
      }} />
    </div>
  );
}

/* ---- Circular score gauge (3/4 arc) with neon glow ---- */
function ScoreGauge({ score, size = 120, label = "Overall Health" }) {
  const st = scoreState(score);
  const r = 42, cx = 50, cy = 52;
  const C = 2 * Math.PI * r;
  const arc = C * 0.75;
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(score), 80); return () => clearTimeout(t); }, [score]);
  const off = arc - (arc * val) / 100;
  const gid = "gg" + Math.round(r + size);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 100 104" width={size} height={size} style={{ filter: glowOn() ? `drop-shadow(0 0 10px ${st.color}66)` : "none" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--blue-bright)" />
            <stop offset="100%" stopColor={st.color} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth="7"
          strokeDasharray={`${arc} ${C}`} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth="7"
          strokeDasharray={`${arc} ${C}`} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(135 ${cx} ${cy})`} style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }} />
        <text x={cx} y={cy - 1} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text)" fontWeight="700" fontSize="26" fontFamily="var(--font-sans)">{Math.round(val)}</text>
        <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="middle"
          fill="var(--text-mute)" fontSize="9" fontFamily="var(--font-mono)">/ 100</text>
      </svg>
      {label && (
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 700, color: st.color }}>
          {st.label}
        </div>
      )}
    </div>
  );
}

/* ---- Dimension bars (profiling/scoring breakdown) ---- */
function DimensionBars({ dims }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {dims.map((d, i) => {
        const st = scoreState(d.score);
        return (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, width: 92, flexShrink: 0, color: "var(--text-soft)" }}>{d.label}</span>
            <div style={{ flex: 1 }}><ScoreBar score={d.score} height={5} /></div>
            <span style={{ fontSize: 12, fontWeight: 700, width: 24, textAlign: "right", color: st.color, fontFamily: "var(--font-mono)" }}>{d.score}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Sparkline ---- */
function Sparkline({ points, w = 120, h = 40, color = "var(--green)" }) {
  const min = Math.min(...points), max = Math.max(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - ((v - min) / (max - min || 1)) * (h - 6) - 3);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const gid = "sp" + points.join("");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={color} style={{ filter: glowOn() ? `drop-shadow(0 0 4px ${color})` : "none" }} />
    </svg>
  );
}

/* ---- Eyebrow label ---- */
function Eyebrow({ children, color = "var(--text-mute)" }) {
  return <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color, margin: 0 }}>{children}</p>;
}

Object.assign(window, {
  useLucide, glowOn, Icon, scoreState, Card, Button, Chip,
  ScoreBadge, ScoreBar, ScoreGauge, DimensionBars, Sparkline, Eyebrow,
});
