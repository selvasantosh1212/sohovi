"use client";

import { useMemo, useState } from "react";
import { Wrench, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { DQRunResult, RuleResult } from "@/types/dq.types";

interface Props {
  result: DQRunResult;
  headers: string[];
  rows: (string | null)[][];
  onExcludeRows?: (indices: Set<number>) => void;
  onApplyFix?: (column: string, transform: (v: string | null) => string | null) => void;
}

interface Suggestion {
  column: string;
  rule: string;
  issue: string;
  fix: string;
  affectedRows: number[];
  fixType: "fill_null" | "case" | "trim" | "manual";
}

function buildSuggestions(ruleResults: RuleResult[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  for (const r of ruleResults) {
    if (r.status !== "fail" || r.failed_indices.length === 0) continue;
    const col = r.column_name ?? "(dataset)";

    const fixMap: Record<string, { fix: string; fixType: Suggestion["fixType"] }> = {
      not_null:          { fix: "Fill null values with a default — or exclude rows.", fixType: "fill_null" },
      not_empty:         { fix: "Replace empty strings with a default value.", fixType: "fill_null" },
      case_consistency:  { fix: "Standardize letter case across the column.", fixType: "case" },
      format_standardization: { fix: "Trim whitespace and normalize formatting.", fixType: "trim" },
      regex_match:       { fix: "Correct values to match the expected pattern.", fixType: "manual" },
      enum_validation:   { fix: "Replace out-of-range values with an accepted enum member.", fixType: "manual" },
      range_check:       { fix: "Clamp or null-out values outside the allowed range.", fixType: "manual" },
      unique_column:     { fix: "Deduplicate rows or assign unique identifiers.", fixType: "manual" },
      duplicate_detection: { fix: "Remove or merge duplicate records.", fixType: "manual" },
      datatype_check:    { fix: "Cast values to the expected data type.", fixType: "manual" },
      positive_check:    { fix: "Replace negative values with 0 or NULL.", fixType: "fill_null" },
      freshness_check:   { fix: "Update or remove stale records.", fixType: "manual" },
      not_future_date:   { fix: "Correct future-dated timestamps to today or NULL.", fixType: "manual" },
      decimal_places:    { fix: "Round values to the required decimal precision.", fixType: "manual" },
      format_check:      { fix: "Reformat values to conform to the expected template.", fixType: "manual" },
    };

    const entry = fixMap[r.rule_type] ?? { fix: "Review and correct affected records manually.", fixType: "manual" as const };

    suggestions.push({
      column: col,
      rule: r.rule_type,
      issue: r.message,
      fix: entry.fix,
      fixType: entry.fixType,
      affectedRows: r.failed_indices,
    });
  }
  return suggestions;
}

function FillNullFix({
  column,
  onApply,
}: {
  column: string;
  onApply?: (fillValue: string) => void;
}) {
  const [value, setValue] = useState("");
  if (!onApply) return null;
  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        placeholder='Fill value (e.g. "N/A", "0")'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 h-7 rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none focus-visible:border-[#1E3A5F]"
      />
      <button
        type="button"
        disabled={!value.trim()}
        onClick={() => { if (value.trim()) onApply(value.trim()); }}
        className="rounded-md bg-[#1E3A5F] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1E3A5F]/90 disabled:opacity-40 transition-colors"
      >
        Apply fill
      </button>
    </div>
  );
}

function CaseFix({
  column,
  onApply,
}: {
  column: string;
  onApply?: (mode: "upper" | "lower" | "title") => void;
}) {
  if (!onApply) return null;
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-slate-500">Standardize to:</span>
      {(["upper", "lower", "title"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onApply(mode)}
          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors capitalize"
        >
          {mode === "upper" ? "UPPER" : mode === "lower" ? "lower" : "Title Case"}
        </button>
      ))}
    </div>
  );
}

function TrimFix({
  column,
  onApply,
}: {
  column: string;
  onApply?: () => void;
}) {
  if (!onApply) return null;
  return (
    <button
      type="button"
      onClick={onApply}
      className="mt-2 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
    >
      Trim whitespace
    </button>
  );
}

export function RemediationPanel({ result, headers, rows, onExcludeRows, onApplyFix }: Props) {
  const suggestions = useMemo(() => buildSuggestions(result.rule_results), [result]);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set([0]));

  const allFailedIndices = useMemo(() => {
    const s = new Set<number>();
    for (const r of result.rule_results) {
      if (r.status === "fail") r.failed_indices.forEach((i) => s.add(i));
    }
    return s;
  }, [result]);

  function handleExcludeAll() {
    const newSet = new Set(allFailedIndices);
    setExcluded(newSet);
    onExcludeRows?.(newSet);
  }

  function handleExcludeSuggestion(indices: number[]) {
    const newSet = new Set([...excluded, ...indices]);
    setExcluded(newSet);
    onExcludeRows?.(newSet);
  }

  function handleClearExclusions() {
    setExcluded(new Set());
    onExcludeRows?.(new Set());
  }

  function toggleExpanded(i: number) {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">All rules passed — no remediation needed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">
            {allFailedIndices.size.toLocaleString()} row{allFailedIndices.size !== 1 ? "s" : ""} flagged across {suggestions.length} rule{suggestions.length !== 1 ? "s" : ""}
          </span>
          {excluded.size > 0 && (
            <span className="text-xs text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
              {excluded.size} excluded
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {excluded.size > 0 && (
            <button
              onClick={handleClearExclusions}
              className="text-xs text-amber-700 underline hover:no-underline"
            >
              Clear exclusions
            </button>
          )}
          <button
            onClick={handleExcludeAll}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Exclude all failed rows
          </button>
        </div>
      </div>

      {/* Per-rule suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => {
          const isExpanded = expandedRules.has(i);
          return (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              {/* Header row — always visible */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpanded(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpanded(i); } }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate">{s.column}</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 shrink-0">
                    {s.rule.replace(/_/g, " ")}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 shrink-0">
                    {s.affectedRows.length.toLocaleString()} row{s.affectedRows.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleExcludeSuggestion(s.affectedRows); }}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Exclude rows
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expandable body */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 pt-3">{s.issue}</p>

                  <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 flex gap-2">
                    <span className="text-blue-500 shrink-0 text-xs font-bold mt-0.5">FIX</span>
                    <div className="flex-1">
                      <p className="text-xs text-blue-700">{s.fix}</p>
                      {/* Inline fix actions */}
                      {onApplyFix && s.fixType === "fill_null" && (
                        <FillNullFix
                          column={s.column}
                          onApply={(fillValue) =>
                            onApplyFix(s.column, (v) =>
                              v === null || v === "" ? fillValue : v
                            )
                          }
                        />
                      )}
                      {onApplyFix && s.fixType === "case" && (
                        <CaseFix
                          column={s.column}
                          onApply={(mode) =>
                            onApplyFix(s.column, (v) => {
                              if (v === null) return v;
                              if (mode === "upper") return v.toUpperCase();
                              if (mode === "lower") return v.toLowerCase();
                              return v.replace(/\b\w/g, (c) => c.toUpperCase());
                            })
                          }
                        />
                      )}
                      {onApplyFix && s.fixType === "trim" && (
                        <TrimFix
                          column={s.column}
                          onApply={() =>
                            onApplyFix(s.column, (v) => (v ? v.trim() : v))
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Sample affected values */}
                  {s.affectedRows.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5">Sample affected values:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.affectedRows.slice(0, 8).map((ri) => {
                          const colIdx = headers.indexOf(s.column);
                          const val = colIdx >= 0 ? rows[ri]?.[colIdx] : null;
                          return (
                            <span key={ri} className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-mono text-red-600">
                              {val !== null && val !== undefined ? val : <em>null</em>}
                            </span>
                          );
                        })}
                        {s.affectedRows.length > 8 && (
                          <span className="text-[11px] text-slate-400">+{s.affectedRows.length - 8} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
