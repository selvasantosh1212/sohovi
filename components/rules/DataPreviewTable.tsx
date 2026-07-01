"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown, ChevronUp, Table2, Plus,
  ChevronLeft, ChevronRight, CheckCircle2, X, BarChart2, Wand2,
} from "lucide-react";
import Link from "next/link";
import { useFileStore } from "@/store/fileStore";
import { useProfilingStore } from "@/store/profilingStore";
import { useRuleBuilderUIStore } from "@/store/ruleBuilderUIStore";
import { suggestRules } from "@/lib/ml/rule-suggester";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { RuleBuilderPanel } from "@/components/rules/RuleBuilderPanel";
import { RuleSuggestionsPanel } from "@/components/rules/RuleSuggestionsPanel";
import { PlanGate } from "@/components/shared/PlanGate";
import type { DQRule } from "@/types/app.types";

const PREVIEW_ROWS = 10;

interface Props {
  assetId: string;
  columnNames: string[];
  rules: DQRule[];
  /** Serializable string array — converted to Set internally for O(1) lookups */
  existingRuleKeys?: string[];
}

export function DataPreviewTable({ assetId, columnNames, rules, existingRuleKeys }: Props) {
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

  // Selected column lives in a shared store so the "Add Custom Rule" and
  // "AI Rule Identifier" panels elsewhere on the page pick it up automatically —
  // this is the single source of truth instead of a separate copy of those
  // panels living inside this table.
  const activeCol = useRuleBuilderUIStore((s) => s.selectedColumn);
  const setActiveCol = useRuleBuilderUIStore((s) => s.setSelectedColumn);

  const [open, setOpen] = useState(true);
  const [colOffset, setColOffset] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Wider screens can show more columns at once before paging is needed
  const [colWindow, setColWindow] = useState(6);
  useEffect(() => {
    function updateColWindow() {
      const w = window.innerWidth;
      setColWindow(w >= 1536 ? 10 : w >= 1280 ? 8 : 6);
    }
    updateColWindow();
    window.addEventListener("resize", updateColWindow);
    return () => window.removeEventListener("resize", updateColWindow);
  }, []);

  // No data at all — show empty state
  if (!profiles && !fileData) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-400">
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

  const showSlider = headers.length > colWindow;
  const maxOffset = Math.max(0, headers.length - colWindow);
  const effectiveColOffset = Math.min(colOffset, maxOffset);
  const visibleIndices: number[] = showSlider
    ? Array.from({ length: colWindow }, (_, i) => effectiveColOffset + i).filter((i) => i < headers.length)
    : headers.map((_, i) => i);

  // Profile for the active column (if profiling has been run)
  const activeProfile = profiles?.find((p) => p.column_name === activeCol);

  // Suggestion count badges for all headers (shows before clicking) — cheap,
  // local-only computation reused for both the header badges and the action strip.
  const colSuggestionCounts: Record<string, number> = {};
  if (profiles) {
    const allSuggestions = suggestRules(profiles);
    for (const h of headers) {
      colSuggestionCounts[h] = allSuggestions
        .filter((s) => s.column_name === h)
        .filter((s) => !existingKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
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

  return (
    <div className="rounded-lg border-2 border-slate-300 bg-white">
      {/* ── Card header (collapsible) ──────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors rounded-lg"
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
                onClick={() => { setColOffset(Math.max(0, effectiveColOffset - 1)); clearActiveCol(); }}
                disabled={effectiveColOffset === 0}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous columns"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              <span className="text-xs text-slate-500 font-medium select-none">
                Columns {effectiveColOffset + 1}–{Math.min(effectiveColOffset + colWindow, headers.length)}{" "}
                <span className="text-slate-400">of {headers.length}</span>
              </span>

              <button
                type="button"
                onClick={() => { setColOffset(Math.min(maxOffset, effectiveColOffset + 1)); clearActiveCol(); }}
                disabled={effectiveColOffset >= maxOffset}
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
                <span className="text-xs font-semibold text-primary truncate">{activeCol}</span>
                {activeProfile?.inferred_type && (
                  <span className="shrink-0 text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                    {activeProfile.inferred_type}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90 transition-opacity"
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
                  AI Suggestions{colSuggestionCounts[activeCol] > 0 ? ` (${colSuggestionCounts[activeCol]})` : ""}
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
              Click a column header to select it, then add a rule or view AI suggestions for it.
            </p>
          )}

          {/* ── Data table ─────────────────────────────────────────── */}
          <div className="overflow-x-auto rounded-md border-2 border-slate-400 shadow-sm">
            <table className="min-w-full text-xs border-collapse">
              <thead className="bg-slate-200 border-b-2 border-slate-400">
                <tr>
                  {/* Sticky row-number column */}
                  <th className="sticky left-0 z-10 bg-slate-200 px-3 py-2.5 text-left font-bold uppercase tracking-wide text-[10px] text-slate-600 w-10 border-r-2 border-slate-400">
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
                        className={`px-3 py-2.5 text-left font-bold uppercase tracking-wide text-[10px] truncate max-w-[160px] cursor-pointer select-none transition-colors border-r border-slate-300 ${
                          isActive
                            ? "text-white bg-primary ring-2 ring-inset ring-primary"
                            : hasRules
                              ? "bg-mint/20 text-primary border-b-4 border-b-mint hover:bg-mint/30"
                              : "text-slate-700 hover:text-primary hover:bg-slate-300/70"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {h}
                          {isActive && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                          )}
                          {!isActive && hasRules && (
                            <span className="inline-flex items-center justify-center min-w-[1rem] h-4 rounded-full bg-green-700 text-white text-[9px] font-bold px-1 shrink-0">
                              {colRuleCounts[h]}
                            </span>
                          )}
                          {!isActive && !hasRules && colSuggestionCounts[h] > 0 && (
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold shrink-0">
                              {colSuggestionCounts[h]}
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white [&>tr:nth-child(even)]:bg-slate-50">
                {previewRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-accent/5 transition-colors">
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2 font-mono font-semibold text-slate-500 border-r-2 border-slate-300">
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
                          className={`px-3 py-2 font-mono truncate max-w-[160px] transition-colors border-r border-slate-200 ${
                            isActive
                              ? "bg-accent/10 text-slate-800"
                              : hasRules
                                ? "bg-amber-50 text-slate-600"
                                : "text-slate-600"
                          }`}
                        >
                          {cell === null || cell === "" ? (
                            <span className="text-slate-400 italic">null</span>
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

          {/* ── AI suggestions — expands in place below the table ───── */}
          {showSuggestions && activeCol && (
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-3">
              <p className="text-xs font-semibold text-violet-800 mb-2">
                AI Rule Identifier for{" "}
                <span className="font-mono bg-violet-100 px-1 rounded">{activeCol}</span>
              </p>
              {!profiles ? (
                <p className="text-xs text-slate-500">
                  Run profiling on this asset to generate AI DQ Rule suggestions.
                </p>
              ) : (
                <PlanGate
                  minPlan="pro"
                  feature="AI Rule Suggestions"
                  description="AI-powered rule suggestions are available on the Pro plan. Upgrade to get suggested rules based on your column profiles."
                >
                  <RuleSuggestionsPanel
                    assetId={assetId}
                    existingRuleKeys={existingKeys}
                    columnNames={columnNames}
                  />
                </PlanGate>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Add Rule slide-in sheet — stays anchored to this table ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Add Rule{activeCol && (
                <>
                  {" — "}
                  <span className="font-mono text-primary">{activeCol}</span>
                </>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <RuleBuilderPanel assetId={assetId} columnNames={columnNames} existingRules={rules} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
