"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown, ChevronUp, Table2, Plus, Wand2,
  ChevronLeft, ChevronRight, CheckCircle2, X, BarChart2,
} from "lucide-react";
import Link from "next/link";
import { useFileStore } from "@/store/fileStore";
import { useProfilingStore } from "@/store/profilingStore";
import { suggestRules } from "@/lib/ml/rule-suggester";
import { createRule } from "@/app/actions/rules";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { RuleBuilderPanel } from "@/components/rules/RuleBuilderPanel";
import type { SuggestedRule } from "@/types/dq.types";

const PREVIEW_ROWS = 10;
const COL_WINDOW = 6;

const DIM_COLORS: Record<string, string> = {
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

interface Props {
  assetId: string;
  columnNames: string[];
  /** Serializable string array — converted to Set internally for O(1) lookups */
  existingRuleKeys?: string[];
}

export function DataPreviewTable({ assetId, columnNames, existingRuleKeys }: Props) {
  const existingKeys = new Set(existingRuleKeys);

  // Columns that already have at least one DQ rule → highlighted amber
  const columnsWithRules = new Set(
    (existingRuleKeys ?? []).map((k) => k.split("|")[0]).filter(Boolean)
  );
  const colRuleCounts = (existingRuleKeys ?? []).reduce<Record<string, number>>((acc, k) => {
    const col = k.split("|")[0];
    if (col) acc[col] = (acc[col] ?? 0) + 1;
    return acc;
  }, {});
  const fileData = useFileStore((s) => s.data);
  const profiles = useProfilingStore((s) => s.profiles);

  const [open, setOpen] = useState(true);
  const [colOffset, setColOffset] = useState(0);
  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetCol, setSheetCol] = useState<string | null>(null);
  const [acceptedKeys, setAcceptedKeys] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  // No data at all — show empty state
  if (!profiles && !fileData) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
        Upload a file on the Upload tab to preview data here.
      </div>
    );
  }

  // When profiling has been run, derive column headers from profile column names
  // and build rows from sample_values. This guarantees correct column names regardless
  // of what file was uploaded (avoids showing a profiling-export CSV as if it were data).
  let headers: string[];
  let previewRows: (string | null)[][];
  let totalRows: number;

  if (profiles && profiles.length > 0) {
    headers = profiles.map((p) => p.column_name);
    // Transpose: profiles[colIdx].sample_values[rowIdx] → previewRows[rowIdx][colIdx]
    const maxSamples = Math.max(...profiles.map((p) => p.sample_values.length), 0);
    const sampleRowCount = Math.min(maxSamples, PREVIEW_ROWS);
    previewRows = Array.from({ length: sampleRowCount }, (_, rowIdx) =>
      profiles.map((p) => p.sample_values[rowIdx] ?? null)
    );
    totalRows = fileData?.totalRows ?? profiles[0]?.row_count ?? 0;
  } else {
    // Fallback: use raw file data as-is
    const { headers: fh, rows, totalRows: ft } = fileData!;
    headers = fh;
    previewRows = rows.slice(0, PREVIEW_ROWS);
    totalRows = ft;
  }

  const showSlider = headers.length > COL_WINDOW;
  const maxOffset = Math.max(0, headers.length - COL_WINDOW);
  const visibleIndices: number[] = showSlider
    ? Array.from({ length: COL_WINDOW }, (_, i) => colOffset + i).filter((i) => i < headers.length)
    : headers.map((_, i) => i);

  // Profile for the active column (if profiling has been run)
  const activeProfile = profiles?.find((p) => p.column_name === activeCol);

  // ML suggestions for active column, filtered against already-added rules
  const colSuggestions: SuggestedRule[] = activeCol && profiles
    ? suggestRules(profiles)
        .filter((s) => s.column_name === activeCol)
        .filter((s) => !existingKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
        .filter((s) => !acceptedKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
    : [];

  // Suggestion count badges for all headers (shows before clicking)
  const colSuggestionCounts: Record<string, number> = {};
  if (profiles) {
    const allSuggestions = suggestRules(profiles);
    for (const h of headers) {
      colSuggestionCounts[h] = allSuggestions
        .filter((s) => s.column_name === h)
        .filter((s) => !existingKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
        .filter((s) => !acceptedKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
        .length;
    }
  }

  function selectColumn(col: string) {
    if (activeCol !== col) {
      setActiveCol(col);
      setShowSuggestions(false);
    }
  }

  function clearActiveCol() {
    setActiveCol(null);
    setShowSuggestions(false);
  }

  function openRuleSheet(col: string) {
    setSheetCol(col);
    setSheetOpen(true);
  }

  function handleAcceptSuggestion(s: SuggestedRule) {
    const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: s.column_name,
          dimension: s.dimension,
          rule_type: s.rule_type,
          parameters: s.parameters,
          threshold: s.threshold,
          is_suggested: true,
        });
        setAcceptedKeys((prev) => new Set([...prev, key]));
      } catch {
        // silently ignore — user can retry
      }
    });
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* ── Card header (collapsible) ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Table2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Data Preview</span>
            <span className="text-xs text-slate-400">
              · {totalRows.toLocaleString()} rows · {headers.length} col{headers.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 bg-slate-50 text-slate-500">
            {open
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />
            }
          </span>
        </button>

        {open && (
          <div className="px-5 pb-5 space-y-3">

            {/* ── Column navigation (wide datasets only) ─────────────── */}
            {showSlider && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <button
                  type="button"
                  onClick={() => { setColOffset((v) => Math.max(0, v - 1)); setActiveCol(null); }}
                  disabled={colOffset === 0}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous columns"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-xs text-slate-500 font-medium select-none">
                  Columns {colOffset + 1}–{Math.min(colOffset + COL_WINDOW, headers.length)}{" "}
                  <span className="text-slate-400">of {headers.length}</span>
                </span>

                <button
                  type="button"
                  onClick={() => { setColOffset((v) => Math.min(maxOffset, v + 1)); setActiveCol(null); }}
                  disabled={colOffset >= maxOffset}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next columns"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── Column action strip ─────────────────────────────────── */}
            {activeCol ? (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 gap-2 min-h-[40px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-[#1E3A5F] truncate">{activeCol}</span>
                  {activeProfile?.inferred_type && (
                    <span className="shrink-0 text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      {activeProfile.inferred_type}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openRuleSheet(activeCol)}
                    className="flex items-center gap-1 rounded-md bg-[#1E3A5F] px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-[#1E3A5F]/90 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Rule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions((v) => !v)}
                    className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                      showSuggestions
                        ? "bg-violet-50 border-violet-300 text-violet-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Wand2 className="w-3 h-3 text-violet-500" />
                    {profiles
                      ? `AI Rule Identifier${colSuggestions.length > 0 ? ` (${colSuggestions.length})` : ""}`
                      : "AI Rule Identifier"}
                  </button>
                  {profiles && (
                    <Link
                      href={`/dashboard/assets/${assetId}/profile`}
                      className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <BarChart2 className="w-3 h-3" />
                      View Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={clearActiveCol}
                    className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 px-1 select-none">
                Click a column header to select it, then add a rule or view AI Rule Identifier suggestions.
              </p>
            )}

            {/* ── Data table ─────────────────────────────────────────── */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {/* Sticky row-number column */}
                    <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-400 w-10">
                      #
                    </th>
                    {visibleIndices.map((colIdx) => {
                      const h = headers[colIdx];
                      const isActive = activeCol === h;
                      const hasRules = columnsWithRules.has(h);
                      return (
                        <th
                          key={colIdx}
                          onClick={() => activeCol === h ? clearActiveCol() : selectColumn(h)}
                          title={hasRules ? `${h} — ${colRuleCounts[h]} rule(s) added` : `${h} — click to select`}
                          className={`px-3 py-2 text-left font-semibold truncate max-w-[160px] cursor-pointer select-none transition-colors ${
                            isActive
                              ? "text-[#1E3A5F] bg-[#00C9A7]/20 ring-2 ring-inset ring-[#00C9A7]/50"
                              : hasRules
                                ? "bg-[#00C9A7]/10 text-[#1E3A5F] border-b-2 border-[#00C9A7] hover:bg-[#00C9A7]/20"
                                : "text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {h}
                            {isActive && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00C9A7] shrink-0" />
                            )}
                            {!isActive && hasRules && (
                              <span className="inline-flex items-center justify-center min-w-[1rem] h-4 rounded-full bg-[#00C9A7]/30 text-[#1E3A5F] text-[9px] font-bold px-1 shrink-0">
                                {colRuleCounts[h]}
                              </span>
                            )}
                            {!isActive && !hasRules && colSuggestionCounts[h] > 0 && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold shrink-0">
                                {colSuggestionCounts[h]}
                              </span>
                            )}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {previewRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="sticky left-0 z-10 bg-white px-3 py-2 font-mono text-slate-400">
                        {rowIdx + 1}
                      </td>
                      {visibleIndices.map((colIdx) => {
                        const h = headers[colIdx];
                        const cell = row[colIdx];
                        const isActive = activeCol === h;
                        const hasRules = columnsWithRules.has(h);
                        return (
                          <td
                            key={colIdx}
                            title={cell ?? "null"}
                            className={`px-3 py-2 font-mono truncate max-w-[160px] transition-colors ${
                              isActive
                                ? "bg-[#00C9A7]/10 text-slate-700"
                                : hasRules
                                  ? "bg-amber-50/50 text-slate-600"
                                  : "text-slate-600"
                            }`}
                          >
                            {cell === null || cell === "" ? (
                              <span className="text-slate-300 italic">null</span>
                            ) : (
                              cell
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalRows > PREVIEW_ROWS && (
              <p className="text-[11px] text-slate-400 text-right select-none">
                Showing first {PREVIEW_ROWS} of {totalRows.toLocaleString()} rows
              </p>
            )}

            {/* ── AI Rule Identifier panel (expands below table) ──────── */}
            {showSuggestions && activeCol && (
              <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-3 space-y-2">
                <p className="text-xs font-semibold text-violet-800">
                  AI Rule Identifier for{" "}
                  <span className="font-mono bg-violet-100 px-1 rounded">{activeCol}</span>
                </p>

                {!profiles ? (
                  <p className="text-xs text-slate-500">
                    Run profiling on this asset to generate AI DQ Rule suggestions.
                  </p>
                ) : colSuggestions.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No new suggestions — all detected rules have already been added.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {colSuggestions.map((s, idx) => {
                      const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
                      const accepted = acceptedKeys.has(key);
                      const pct = Math.round(s.confidence * 100);
                      const confColor =
                        pct >= 85 ? "text-green-600" :
                        pct >= 70 ? "text-amber-600" :
                        "text-slate-500";

                      return (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-3 rounded-md bg-white border border-violet-100 px-3 py-2.5"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[11px] font-medium text-slate-700">
                                {s.rule_type.replace(/_/g, " ")}
                              </span>
                              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${DIM_COLORS[s.dimension] ?? "bg-slate-100 text-slate-600"}`}>
                                {s.dimension}
                              </span>
                              <span className={`text-[11px] font-semibold ${confColor}`}>
                                {pct}% confidence
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{s.reason}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAcceptSuggestion(s)}
                            disabled={accepted}
                            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                              accepted
                                ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                                : "bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90"
                            }`}
                          >
                            {accepted ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Added
                              </span>
                            ) : "Accept"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add Rule slide-in sheet ─────────────────────────────────── */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(isOpen) => { if (!isOpen) { setSheetOpen(false); setSheetCol(null); } }}
      >
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Add Rule —{" "}
              <span className="font-mono text-[#1E3A5F]">{sheetCol}</span>
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {sheetCol && (
              <RuleBuilderPanel
                assetId={assetId}
                columnNames={columnNames}
                initialColumn={sheetCol}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
