"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AssetRun } from "@/types/app.types";

interface Props {
  runs: AssetRun[];
}

function scoreColor(score: number) {
  if (score >= 95) return "#10B981";
  if (score >= 80) return "#00C9A7";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

interface ChartPoint {
  date: string;
  score: number;
  file: string;
  isAnomaly: boolean;
}

interface TooltipPayload {
  value: number;
  payload: ChartPoint;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const { value, payload: data } = payload[0];
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg text-sm space-y-1">
      <p className="font-semibold" style={{ color: scoreColor(value) }}>
        Score: {value}
      </p>
      {data.isAnomaly && (
        <p className="text-xs text-red-500 font-medium">⚠ Anomaly — significant drop</p>
      )}
      <p className="text-slate-500 text-xs">{data.date}</p>
      <p className="text-slate-400 text-xs truncate max-w-[180px]">{data.file}</p>
    </div>
  );
}

function CustomDot(props: {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
}) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const score = payload.score;
  const color = scoreColor(score);
  const isAnomaly = payload.isAnomaly;

  return (
    <g>
      {isAnomaly && (
        <circle cx={cx} cy={cy} r={9} fill="#FEF2F2" stroke="#EF4444" strokeWidth={2} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isAnomaly ? 5 : 4}
        fill={isAnomaly ? "#EF4444" : color}
        stroke="white"
        strokeWidth={1.5}
      />
      {isAnomaly && (
        <text x={cx} y={cy - 14} textAnchor="middle" fill="#EF4444" fontSize={9} fontWeight="bold">
          !
        </text>
      )}
    </g>
  );
}

const REFERENCE_LEGEND = [
  { label: "Excellent (≥95)", color: "#10B981" },
  { label: "Good (≥80)",      color: "#00C9A7" },
  { label: "Fair (≥60)",      color: "#F59E0B" },
];

export function ScoreTrendChart({ runs }: Props) {
  const data: ChartPoint[] = [...runs]
    .filter((r) => r.overall_dq_score !== null)
    .reverse()
    .map((r, i, arr) => {
      const prev = arr[i - 1];
      const score = r.overall_dq_score as number;
      const prevScore = prev?.overall_dq_score ?? score;
      const isAnomaly = i > 0 && prevScore - score >= 10;
      return {
        date: new Date(r.run_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score,
        file: r.file_name,
        isAnomaly,
      };
    });

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
        No run data yet
      </div>
    );
  }

  // Delta chip
  const latestScore = data[data.length - 1]?.score;
  const prevScore = data[data.length - 2]?.score;
  const delta = prevScore !== undefined ? latestScore - prevScore : null;

  return (
    <div className="space-y-3">
      {/* Header row with delta chip */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-3 text-xs">
          {REFERENCE_LEGEND.map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1 text-slate-500">
              <span className="inline-block w-6 h-0.5" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
        {delta !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              delta > 0
                ? "bg-emerald-50 text-emerald-700"
                : delta < 0
                ? "bg-red-50 text-red-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {delta > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : delta < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            {delta > 0 ? "+" : ""}{delta} pts since last run
          </span>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#00C9A7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={95} stroke="#10B981" strokeDasharray="4 2" strokeWidth={1} />
          <ReferenceLine y={80} stroke="#00C9A7" strokeDasharray="4 2" strokeWidth={1} />
          <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="4 2" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="score"
            fill="url(#scoreGradient)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#1E3A5F"
            strokeWidth={2}
            dot={(props) => <CustomDot key={`dot-${props.index}`} {...props} />}
            activeDot={{ r: 5, fill: "#1E3A5F" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
