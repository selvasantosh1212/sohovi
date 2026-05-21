"use client";

import { Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface Props {
  score: number; // 0–100
  size?: "sm" | "md" | "lg";
  label?: string;
  animated?: boolean;
}

const SIZE = {
  sm: { r: 38, stroke: 6, fontSize: "text-xl", labelSize: "text-[10px]", viewBox: 90 },
  md: { r: 54, stroke: 8, fontSize: "text-3xl", labelSize: "text-xs",    viewBox: 130 },
  lg: { r: 72, stroke: 10, fontSize: "text-5xl", labelSize: "text-sm",   viewBox: 170 },
};

function scoreColor(score: number): string {
  if (score >= 95) return "#10B981"; // emerald
  if (score >= 80) return "#00C9A7"; // teal
  if (score >= 60) return "#F59E0B"; // amber
  return "#EF4444";                  // red
}

function scoreLabel(score: number): string {
  if (score >= 95) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Warning";
  return "Critical";
}

export function ScoreGauge({ score, size = "md", label, animated = true }: Props) {
  const cfg = SIZE[size];
  const center = cfg.viewBox / 2;
  const circumference = 2 * Math.PI * cfg.r;
  // Semi-circle gauge: we use 75% of circumference so it looks like a speedometer
  const arcLen = circumference * 0.75;
  const dashOffset = arcLen - (arcLen * Math.min(100, Math.max(0, score))) / 100;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox={`0 0 ${cfg.viewBox} ${cfg.viewBox}`}
        width={cfg.viewBox}
        height={cfg.viewBox}
        className="overflow-visible"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={cfg.r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={cfg.stroke}
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={cfg.r}
          fill="none"
          stroke={color}
          strokeWidth={cfg.stroke}
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
          style={animated ? { transition: "stroke-dashoffset 0.8s ease" } : undefined}
        />
        {/* Score text */}
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontWeight="700"
          fontSize={cfg.r * 0.55}
          fontFamily="inherit"
        >
          {Math.round(score)}
        </text>
        {/* "/100" */}
        <text
          x={center}
          y={center + cfg.r * 0.45}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize={cfg.r * 0.22}
          fontFamily="inherit"
        >
          {scoreLabel(score)}
        </text>
      </svg>
      {label && (
        <span className="text-xs text-slate-500 text-center">{label}</span>
      )}
      {/* Score legend tooltip */}
      <Tooltip content="DQ Score: 95–100 = Excellent | 80–94 = Good | 60–79 = Warning | below 60 = Critical">
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-help"
          aria-label="What does this score mean?"
        >
          <Info className="w-3 h-3" />
          What does this mean?
        </button>
      </Tooltip>
    </div>
  );
}
