"use client";

import { useState } from "react";
import type { AssetRun } from "@/types/app.types";

interface Props {
  runs: AssetRun[];
}

function delta(a: number | null, b: number | null): React.ReactNode {
  if (a === null || b === null) return <span className="text-slate-400">—</span>;
  const d = a - b;
  if (d === 0) return <span className="text-slate-400">±0</span>;
  const color = d > 0 ? "text-emerald-600" : "text-red-600";
  return <span className={color}>{d > 0 ? "+" : ""}{d.toFixed(1)}</span>;
}

export function RunComparisonTable({ runs }: Props) {
  const scored = runs.filter((r) => r.overall_dq_score !== null);
  const [aIdx, setAIdx] = useState(0);
  const [bIdx, setBIdx] = useState(Math.min(1, scored.length - 1));

  if (scored.length < 2) {
    return (
      <p className="text-sm text-slate-400 py-4">
        Need at least 2 scored runs to compare.
      </p>
    );
  }

  const runA = scored[aIdx];
  const runB = scored[bIdx];

  const rows: { label: string; a: React.ReactNode; b: React.ReactNode; diff?: React.ReactNode }[] = [
    {
      label: "Overall Score",
      a: <span className="font-bold">{runA.overall_dq_score}</span>,
      b: <span className="font-bold">{runB.overall_dq_score}</span>,
      diff: delta(runA.overall_dq_score, runB.overall_dq_score),
    },
    {
      label: "Row Count",
      a: runA.row_count?.toLocaleString() ?? "—",
      b: runB.row_count?.toLocaleString() ?? "—",
      diff: delta(runA.row_count, runB.row_count),
    },
    {
      label: "Columns",
      a: runA.column_count ?? "—",
      b: runB.column_count ?? "—",
    },
    {
      label: "Schema Changed",
      a: runA.schema_changed ? "Yes" : "No",
      b: runB.schema_changed ? "Yes" : "No",
    },
    {
      label: "File",
      a: <span className="truncate max-w-[120px] block">{runA.file_name}</span>,
      b: <span className="truncate max-w-[120px] block">{runB.file_name}</span>,
    },
    {
      label: "Run Date",
      a: new Date(runA.run_at).toLocaleDateString(),
      b: new Date(runB.run_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Selectors */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Run A</span>
          <select
            value={aIdx}
            onChange={(e) => setAIdx(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            {scored.map((r, i) => (
              <option key={r.id} value={i}>
                {new Date(r.run_at).toLocaleDateString()} — {r.overall_dq_score}
              </option>
            ))}
          </select>
        </div>
        <span className="text-slate-300">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Run B</span>
          <select
            value={bIdx}
            onChange={(e) => setBIdx(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            {scored.map((r, i) => (
              <option key={r.id} value={i}>
                {new Date(r.run_at).toLocaleDateString()} — {r.overall_dq_score}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/4">Metric</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Run A</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Run B</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Δ (A−B)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                <td className="px-4 py-2.5 text-slate-600 font-medium">{row.label}</td>
                <td className="px-4 py-2.5 text-slate-800">{row.a}</td>
                <td className="px-4 py-2.5 text-slate-800">{row.b}</td>
                <td className="px-4 py-2.5 font-medium">{row.diff ?? <span className="text-slate-400">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
