"use client";

import type { RuleResult } from "@/types/dq.types";
import { Tooltip } from "@/components/ui/tooltip";
import { DQ_DIMENSION_DESCRIPTIONS } from "@/lib/dq-dimension-descriptions";
import { getFriendlyMessage, renderFriendly } from "@/lib/dq-engine/friendly-messages";

interface Props {
  ruleResults: RuleResult[];
  columnName: string | null; // null = show all
}

const DIMENSION_BADGE: Record<string, string> = {
  completeness: "bg-blue-100 text-blue-700",
  validity:     "bg-purple-100 text-purple-700",
  accuracy:     "bg-green-100 text-green-700",
  uniqueness:   "bg-yellow-100 text-yellow-700",
  consistency:  "bg-orange-100 text-orange-700",
  integrity:    "bg-red-100 text-red-700",
  timeliness:   "bg-teal-100 text-teal-700",
  currency:     "bg-cyan-100 text-cyan-700",
  conformity:   "bg-indigo-100 text-indigo-700",
  precision:    "bg-pink-100 text-pink-700",
};

export function ScoreTransparencyPanel({ ruleResults, columnName }: Props) {
  const filtered = columnName
    ? ruleResults.filter((r) => r.column_name === columnName)
    : ruleResults;

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4 text-center">
        {columnName ? `No rules for "${columnName}".` : "No rules evaluated."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-slate-400">A rule passes when its score meets or exceeds the threshold.</p>
      {filtered.map((r) => {
        const pct = Math.round(r.score * 100);
        const pass = r.status === "pass";
        return (
          <div
            key={`${r.rule_id}-${r.column_name}`}
            className={`rounded-lg border px-3 py-2.5 ${
              pass ? "border-slate-200 bg-white" : "border-red-200 bg-red-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-800">
                    {r.rule_type.replace(/_/g, " ")}
                  </span>
                  {r.column_name && r.column_name !== "__dataset__" && (
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                      {r.column_name}
                    </span>
                  )}
                  <Tooltip
                    content={
                      DQ_DIMENSION_DESCRIPTIONS[r.dimension] ?? r.dimension
                    }
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize cursor-help ${
                        DIMENSION_BADGE[r.dimension] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.dimension}
                    </span>
                  </Tooltip>
                </div>
                {!pass && (() => {
                  const friendly = getFriendlyMessage(r);
                  return friendly ? (
                    <p className="text-xs text-slate-700 mt-1 leading-snug">
                      {renderFriendly(friendly).map((part, i) =>
                        part.bold
                          ? <strong key={i} className="font-semibold">{part.text}</strong>
                          : <span key={i}>{part.text}</span>
                      )}
                    </p>
                  ) : null;
                })()}
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">
                  <span className="not-italic text-slate-300">Detail: </span>{r.message}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span
                  className={`text-xs font-bold ${
                    pass ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {pct}%
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    pass
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {pass ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-2 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pass ? "bg-emerald-400" : "bg-red-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Threshold + records */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-slate-400">
                threshold {Math.round(r.threshold * 100)}%
              </span>
              {r.failed_records > 0 && (
                <span className="text-[10px] text-red-400 font-medium">
                  {r.failed_records.toLocaleString()} failed record{r.failed_records !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
