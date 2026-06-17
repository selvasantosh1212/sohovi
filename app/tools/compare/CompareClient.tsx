"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Download, AlertCircle, Loader2, CheckSquare, Square, Lock } from "lucide-react";
import { parseFile, type ParsedFile, rowsToCSV, downloadCSV } from "@/lib/tools/csv-parse";
import { keyedDiff, suggestKeyColumns, type DiffResult } from "@/lib/tools/keyed-diff";

type Tab = "onlyInA" | "onlyInB" | "changed" | "unchanged";

const TAB_CONFIG: { id: Tab; label: string; emptyLabel: string; color: string; bg: string }[] = [
  { id: "onlyInA", label: "Removed (only in A)", emptyLabel: "No removed rows", color: "#E07150", bg: "rgba(224,113,80,0.08)" },
  { id: "onlyInB", label: "Added (only in B)", emptyLabel: "No added rows", color: "#00C9A7", bg: "rgba(0,201,167,0.08)" },
  { id: "changed", label: "Changed", emptyLabel: "No changed rows", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  { id: "unchanged", label: "Unchanged", emptyLabel: "All rows changed", color: "var(--ink-mute)", bg: "var(--cream)" },
];

const faqs: FAQItem[] = [
  {
    q: "How does the comparison work?",
    a: "The tool performs a keyed join on your chosen columns. Rows where the key exists in both files are compared cell by cell to detect changes. Rows that appear in only one file are reported as added or removed.",
  },
  {
    q: "Is my data uploaded to a server?",
    a: "No. Both files are read and compared entirely in your browser. Nothing is sent to any server — open DevTools → Network to verify.",
  },
  {
    q: "Do the two files need the same columns?",
    a: "No. The tool merges the column sets from both files. Columns that only exist in one file appear with blank values for the other file.",
  },
  {
    q: "What is fuzzy matching and why is it not free?",
    a: "Fuzzy matching tolerates small variations in key values — e.g., 'Bob Smith' matching 'Robert Smith', or 'Inc.' matching 'Inc'. It's more computationally intensive and is available as a paid Sohovi feature.",
  },
  {
    q: "What file types are supported?",
    a: "CSV (.csv) and Excel (.xlsx, .xls). Both files are read entirely in the browser.",
  },
];

const USE_CASES: UseCase[] = [
  {
    persona: "RevOps Analyst",
    domain: "Sales Operations",
    icon: "📊",
    scenario: "Comparing last month's CRM export to this month's to understand which deals closed, which accounts churned, and which records were updated.",
    outcome: "Drops both exports in, keys on account_id. In seconds: 14 new accounts, 3 removed (churned), 22 changed (stage updates). Exports the changed set for stakeholder reporting.",
  },
  {
    persona: "Finance Manager",
    domain: "Accounting / Finance",
    icon: "📒",
    scenario: "Reconciling a vendor invoice CSV against the approved purchase order. Needs to find line items that don't match before approving payment.",
    outcome: "Keys on PO line item number. Finds 3 rows in the invoice but not the PO, and 2 amount discrepancies in changed rows. Flags for AP review before payment runs.",
  },
  {
    persona: "E-commerce Ops",
    domain: "Retail",
    icon: "🛒",
    scenario: "Comparing product catalog exports before and after a bulk edit to verify only the intended changes were applied.",
    outcome: "Keys on SKU. Confirms 150 price updates were applied correctly, no unintended changes to other columns.",
  },
  {
    persona: "Data Analyst",
    domain: "Healthcare / Research",
    icon: "🏥",
    scenario: "Comparing two versions of a patient registry export after a data migration to verify all records transferred intact.",
    outcome: "Keys on patient_id. Zero rows in 'only in A' or 'only in B' — all records present. 4 changed rows: address corrections that were expected.",
  },
];

const relatedTools = [
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove exact duplicate rows from any CSV" },
  { name: "CSV Merger", href: "/tools/csv-merger", description: "Stack or join multiple CSV files into one" },
  { name: "PII Audit", href: "/tools/pii-audit", description: "Check any file for personal data before sharing" },
];

export function CompareClient() {
  const [fileA, setFileA] = useState<ParsedFile | null>(null);
  const [fileB, setFileB] = useState<ParsedFile | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<DiffResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("onlyInB");

  async function handleFileA(file: File) {
    setLoadingA(true);
    setError(null);
    setResult(null);
    setSelectedKeys(new Set());
    try {
      const parsed = await parseFile(file);
      setFileA(parsed);
      // Auto-select suggested key columns
      const suggested = suggestKeyColumns(parsed.headers);
      if (suggested.length > 0) setSelectedKeys(new Set(suggested.slice(0, 1)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read File A");
    } finally {
      setLoadingA(false);
    }
  }

  async function handleFileB(file: File) {
    setLoadingB(true);
    setError(null);
    setResult(null);
    try {
      const parsed = await parseFile(file);
      setFileB(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read File B");
    } finally {
      setLoadingB(false);
    }
  }

  function toggleKey(col: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  }

  function runDiff() {
    if (!fileA || !fileB) return;
    if (selectedKeys.size === 0) {
      setError("Please select at least one key column to match rows between the files.");
      return;
    }
    const missingInB = Array.from(selectedKeys).filter((k) => !fileB.headers.includes(k));
    if (missingInB.length > 0) {
      setError(
        `Key column "${missingInB[0]}" doesn't exist in File B. Select a column that appears in both files.`
      );
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const keys = Array.from(selectedKeys);
        const diff = keyedDiff(fileA.headers, fileA.rows, fileB.headers, fileB.rows, keys);
        setResult(diff);
        // Default to the most interesting tab
        if (diff.onlyInB.length > 0) setActiveTab("onlyInB");
        else if (diff.onlyInA.length > 0) setActiveTab("onlyInA");
        else if (diff.changed.length > 0) setActiveTab("changed");
        else setActiveTab("unchanged");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Comparison failed");
      } finally {
        setLoading(false);
      }
    }, 10);
  }

  function handleExport(tab: Tab) {
    if (!result) return;
    if (tab === "changed") {
      const remapped = result.changed.map((c) =>
        result.headers.map((h) => {
          const bIdx = fileB ? fileB.headers.indexOf(h) : -1;
          return bIdx !== -1 ? (c.rowB[bIdx] ?? "") : "";
        })
      );
      downloadCSV(rowsToCSV(result.headers, remapped), "changed-rows.csv");
    } else {
      const rows = tab === "onlyInA" ? result.onlyInA : tab === "onlyInB" ? result.onlyInB : result.unchanged;
      const headers = tab === "onlyInA" ? (fileA?.headers ?? result.headers) :
                      tab === "onlyInB" ? (fileB?.headers ?? result.headers) : result.headers;
      downloadCSV(rowsToCSV(headers, rows), `${tab}.csv`);
    }
  }

  const canRun = !!fileA && !!fileB && selectedKeys.size > 0;
  // Use fileA's headers for the key picker
  const keyHeaders = fileA?.headers ?? [];

  return (
    <article className="mx-auto max-w-[820px] px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div
          className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(0,201,167,0.08)", color: "#00A88E", border: "1px solid rgba(0,201,167,0.2)" }}
        >
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Compare Two CSV Files Online
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Drop two spreadsheets and see exactly what changed — added rows, removed rows, and
          modified cells, matched on any key column.{" "}
          <strong style={{ color: "var(--ink)" }}>Nothing uploaded. Works in your browser.</strong>
        </p>
      </header>

      {/* Upload zones */}
      {!result && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>
                File A — baseline
              </p>
              {fileA ? (
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--mint)", background: "rgba(0,201,167,0.04)" }}>
                  <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>{fileA.fileName}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>
                    {fileA.rowCount.toLocaleString()} rows · {fileA.headers.length} columns
                  </p>
                  <button
                    onClick={() => { setFileA(null); setResult(null); setSelectedKeys(new Set()); }}
                    className="text-[12px] mt-2 underline underline-offset-2"
                    style={{ color: "var(--ink-mute)" }}
                  >
                    Replace
                  </button>
                </div>
              ) : (
                loadingA ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl border" style={{ borderColor: "var(--hair-strong)" }}>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--ink-mute)" }} />
                    <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>Reading…</span>
                  </div>
                ) : (
                  <UploadZone onFile={handleFileA} label="Drop File A here" sublabel="CSV or Excel" />
                )
              )}
            </div>

            <div>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--ink-soft)" }}>
                File B — updated version
              </p>
              {fileB ? (
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--mint)", background: "rgba(0,201,167,0.04)" }}>
                  <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>{fileB.fileName}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>
                    {fileB.rowCount.toLocaleString()} rows · {fileB.headers.length} columns
                  </p>
                  <button
                    onClick={() => { setFileB(null); setResult(null); setSelectedKeys(new Set()); }}
                    className="text-[12px] mt-2 underline underline-offset-2"
                    style={{ color: "var(--ink-mute)" }}
                  >
                    Replace
                  </button>
                </div>
              ) : (
                loadingB ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl border" style={{ borderColor: "var(--hair-strong)" }}>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--ink-mute)" }} />
                    <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>Reading…</span>
                  </div>
                ) : (
                  <UploadZone onFile={handleFileB} label="Drop File B here" sublabel="CSV or Excel" />
                )
              )}
            </div>
          </div>

          {/* Key column picker */}
          {fileA && fileB && (
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                  Choose your match key
                </h2>
                {selectedKeys.size > 0 && (
                  <span className="text-[12px]" style={{ color: "var(--ink-mute)" }}>
                    {Array.from(selectedKeys).join(", ")}
                  </span>
                )}
              </div>
              <p className="text-[13px] mb-4" style={{ color: "var(--ink-soft)" }}>
                Select the column(s) that uniquely identify each row — e.g. an ID, email, or order number.
                Columns shown in teal are auto-suggested as likely keys.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {keyHeaders.map((h) => {
                  const checked = selectedKeys.has(h);
                  const suggested = suggestKeyColumns(keyHeaders).includes(h);
                  return (
                    <button
                      key={h}
                      onClick={() => toggleKey(h)}
                      className="flex items-center gap-2 text-left px-3 py-2.5 rounded-lg border transition-all text-[13px]"
                      style={{
                        borderColor: checked ? "var(--mint)" : suggested ? "rgba(0,201,167,0.3)" : "var(--hair-strong)",
                        background: checked ? "rgba(0,201,167,0.06)" : suggested ? "rgba(0,201,167,0.02)" : "transparent",
                        color: "var(--ink)",
                      }}
                    >
                      {checked
                        ? <CheckSquare className="w-4 h-4 shrink-0" style={{ color: "var(--mint)" }} />
                        : <Square className="w-4 h-4 shrink-0" style={{ color: "var(--ink-mute)" }} />
                      }
                      <span className="truncate">{h}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <p className="text-[14px] text-red-700">{error}</p>
            </div>
          )}

          {fileA && fileB && (
            <button
              onClick={runDiff}
              disabled={!canRun || loading}
              className="w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-50"
              style={{ background: "var(--ink)", color: "white" }}
              onMouseEnter={(e) => { if (canRun) (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Comparing…
                </span>
              ) : "Compare files"}
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Removed (only in A)", value: result.onlyInA.length, color: "#E07150" },
              { label: "Added (only in B)", value: result.onlyInB.length, color: "#00C9A7" },
              { label: "Changed", value: result.changed.length, color: "#F59E0B" },
              { label: "Unchanged", value: result.unchanged.length, color: "var(--ink-mute)" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
                <div className="text-[24px] font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
                <div className="text-[11px] mt-0.5 leading-tight" style={{ color: "var(--ink-mute)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <SoftCTA text="Running this reconciliation monthly? Sohovi can compare datasets automatically on every sync and alert you when records change →" />

          {/* Tabs */}
          <div>
            <div className="flex gap-1 flex-wrap mb-4">
              {TAB_CONFIG.map((tab) => {
                const count = tab.id === "changed" ? result.changed.length :
                              tab.id === "onlyInA" ? result.onlyInA.length :
                              tab.id === "onlyInB" ? result.onlyInB.length :
                              result.unchanged.length;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      background: active ? tab.bg : "transparent",
                      color: active ? tab.color : "var(--ink-mute)",
                      border: active ? `1px solid ${tab.color}40` : "1px solid transparent",
                    }}
                  >
                    {tab.label}
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: active ? `${tab.color}20` : "var(--cream)", color: active ? tab.color : "var(--ink-mute)" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {(() => {
              const tab = TAB_CONFIG.find((t) => t.id === activeTab)!;
              const isChanged = activeTab === "changed";
              const rows = isChanged
                ? result.changed.map((c) => c.rowB)
                : activeTab === "onlyInA" ? result.onlyInA
                : activeTab === "onlyInB" ? result.onlyInB
                : result.unchanged;
              const displayHeaders = activeTab === "onlyInA" ? (fileA?.headers ?? result.headers)
                                   : activeTab === "onlyInB" ? (fileB?.headers ?? result.headers)
                                   : result.headers;

              if (rows.length === 0) {
                return (
                  <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
                    <p className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>{tab.emptyLabel}</p>
                  </div>
                );
              }

              // Changed rows: highlight diff cells
              const changedDiffsMap = isChanged
                ? new Map(result.changed.map((c) => [c.key, new Set(c.diffs.map((d) => d.column))]))
                : null;

              return (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
                  <div className="px-5 py-3 flex items-center justify-between" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      {isChanged ? "Changed rows — cells highlighted where B differs from A" : `First ${Math.min(rows.length, 50)} rows`}
                    </span>
                    <button
                      onClick={() => handleExport(activeTab)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: "var(--ink)", color: "white" }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--hair)" }}>
                          {displayHeaders.map((h) => (
                            <th key={h} className="text-left px-4 py-2 font-semibold whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 50).map((row, i) => {
                          const changedKey = isChanged ? result.changed[i]?.key : null;
                          const diffCols = changedKey && changedDiffsMap ? changedDiffsMap.get(changedKey) : null;
                          return (
                            <tr key={i} style={{ borderBottom: "1px solid var(--hair)" }}>
                              {displayHeaders.map((h, j) => {
                                const isChanged2 = !!diffCols?.has(h);
                                const cellValue = isChanged && fileB
                                  ? (row[fileB.headers.indexOf(h)] ?? "")
                                  : (row[j] ?? "");
                                return (
                                  <td
                                    key={j}
                                    className="px-4 py-2 whitespace-nowrap max-w-[200px] truncate"
                                    style={{
                                      color: "var(--ink)",
                                      background: isChanged2 ? "rgba(245,158,11,0.1)" : undefined,
                                      fontWeight: isChanged2 ? 600 : undefined,
                                    }}
                                  >
                                    {cellValue}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {rows.length > 50 && (
                    <div className="px-5 py-3 text-[12px]" style={{ background: "var(--cream)", borderTop: "1px solid var(--hair)", color: "var(--ink-mute)" }}>
                      Showing first 50 of {rows.length.toLocaleString()} rows. Export CSV to see all.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Paid upsell */}
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4" style={{ color: "var(--ink-mute)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink-soft)" }}>
                Sohovi Business — fuzzy matching & scheduled reconciliation
              </span>
            </div>
            <p className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
              Match "Bob Smith" to "Robert Smith", tolerate ±$0.01 rounding differences, set date
              tolerance windows, and run this reconciliation automatically every month.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setResult(null); setFileA(null); setFileB(null); setSelectedKeys(new Set()); }}
              className="px-5 py-3 rounded-xl text-[14px] border transition-all"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}
            >
              Start over
            </button>
          </div>

          <HardCTA
            headline="Reconcile datasets automatically — on every sync"
            body="Sohovi connects to your data sources directly and runs keyed comparisons automatically. Get alerted when records appear, disappear, or change — without downloading files."
            bullets={[
              "Scheduled reconciliation against CRMs, databases, and cloud files",
              "Fuzzy key matching — tolerates name variations, spacing, and format differences",
              "Change history and trend tracking across every reconciliation run",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="Two-File Reconciler" />

      {/* How it works */}
      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>
          How to compare two CSV files for differences
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Upload File A and File B",
              body: "File A is your baseline (the older version). File B is the updated version. Both are read entirely in your browser — nothing is sent to any server.",
            },
            {
              step: "2",
              title: "Pick your match key",
              body: "Select the column(s) that uniquely identify each row — an ID, email, or order number. The tool auto-suggests likely keys. You can select multiple columns for composite keys.",
            },
            {
              step: "3",
              title: "Review the four buckets and export",
              body: "See rows only in A (removed), only in B (added), changed (same key, different values with cell-level highlighting), and unchanged. Export any bucket as CSV.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>
                {s.step}
              </div>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{s.title}</p>
                <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO content */}
      <section className="mt-14 space-y-4">
        <h2 className="text-[22px] font-bold" style={{ color: "var(--ink)" }}>
          Why VLOOKUP isn't the right tool for spreadsheet comparison
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Finding rows in one CSV but not another is a common task — comparing a vendor invoice to
          a purchase order, reconciling a bank export to a ledger, or verifying a data migration
          landed intact. Most people reach for VLOOKUP. It works for small files, but it only tells
          you whether a key exists in the other file — it won't highlight which fields changed, and
          it breaks when the two files have different column orders.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          This tool does a proper keyed diff: it matches rows by the column you choose, compares
          every field, and gives you four clean buckets you can act on. Cell-level change
          highlighting shows exactly which fields changed in matched rows, so you don't have to
          compare columns manually.
        </p>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/compare" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
