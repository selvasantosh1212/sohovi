"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ValueFreq } from "@/types/profiling.types";

interface ValueFrequencyChartProps {
  data: ValueFreq[];
  maxBars?: number;
}

const BAR_COLOR = "#00C9A7";
const BAR_COLOR_ALT = "#1E3A5F";

export function ValueFrequencyChart({ data, maxBars = 10 }: ValueFrequencyChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = data
    .slice(0, maxBars)
    .map((d) => ({ name: String(d.value).slice(0, 20), count: d.count, pct: d.pct }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value, _name, props) => [
            `${Number(value).toLocaleString()} (${(props.payload as { pct?: number })?.pct ?? 0}%)`,
            "Count",
          ]}
          contentStyle={{
            fontSize: 12,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "6px 12px",
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={i === 0 ? BAR_COLOR : i === 1 ? BAR_COLOR_ALT : BAR_COLOR} fillOpacity={1 - i * 0.06} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
