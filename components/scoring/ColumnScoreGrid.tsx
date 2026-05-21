"use client";

import type { ColumnScore } from "@/types/dq.types";

interface Props {
  columnScores: ColumnScore[];
  onSelectColumn?: (name: string) => void;
  selectedColumn?: string | null;
}

function barColor(score: number): string {
  if (score >= 0.95) return "bg-emerald-500";
  if (score >= 0.80) return "bg-[#00C9A7]";
  if (score >= 0.60) return "bg-amber-400";
  return "bg-red-500";
}

function textColor(score: number): string {
  if (score >= 0.95) return "text-emerald-600";
  if (score >= 0.80) return "text-[#00C9A7]";
  if (score >= 0.60) return "text-amber-500";
  return "text-red-500";
}

export function ColumnScoreGrid({ columnScores, onSelectColumn, selectedColumn }: Props) {
  if (columnScores.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">No column scores.</p>
    );
  }

  const sorted = [...columnScores].sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-2">
      {sorted.map((col) => {
        const pct = Math.round(col.score * 100);
        const isSelected = selectedColumn === col.column_name;
        return (
          <button
            key={col.column_name}
            type="button"
            onClick={() => onSelectColumn?.(col.column_name)}
            className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
              isSelected
                ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-700 truncate max-w-[65%] font-mono">
                {col.column_name === "__dataset__" ? "Dataset" : col.column_name}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {col.fail_count > 0 && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {col.fail_count} rule{col.fail_count !== 1 ? "s" : ""} failed
                  </span>
                )}
                <span className={`text-xs font-bold ${textColor(col.score)}`}>
                  {pct}%
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor(col.score)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
