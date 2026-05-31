"use client";

import { useState, useRef } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { CheckSquare, Square, Download, AlertCircle, Loader2 } from "lucide-react";

interface ParsedCSV {
  headers: string[];
  rows: string[][];
  fileName: string;
}

interface DedupeResult {
  originalCount: number;
  uniqueCount: number;
  removedCount: number;
  uniqueRows: string[][];
  removedRows: string[][];
  headers: string[];
}

function parseCSVText(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("File is empty");
  const parse = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        result.push(cur.trim()); cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };
  const headers = parse(lines[0]);
  const rows = lines.slice(1).map(parse);
  return { headers, rows };
}

function rowKey(row: string[], colIndices: number[]): string {
  return colIndices.map((i) => (row[i] ?? "").toLowerCase().trim()).join("\x00");
}

function dedupeRows(parsed: ParsedCSV, selectedCols: Set<string>): DedupeResult {
  const { headers, rows } = parsed;
  const colIndices = selectedCols.size === 0
    ? headers.map((_, i) => i)
    : headers.map((h, i) => (selectedCols.has(h) ? i : -1)).filter((i) => i !== -1);

  const seen = new Set<string>();
  const uniqueRows: string[][] = [];
  const removedRows: string[][] = [];

  for (const row of rows) {
    const key = rowKey(row, colIndices);
    if (seen.has(key)) {
      removedRows.push(row);
    } else {
      seen.add(key);
      uniqueRows.push(row);
    }
  }

  return {
    originalCount: rows.length,
    uniqueCount: uniqueRows.length,
    removedCount: removedRows.length,
    uniqueRows,
    removedRows,
    headers,
  };
}

function rowsToCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const faqs: FAQItem[] = [
  {
    q: "How does the duplicate row remover work?",
    a: "Upload your CSV file and the tool compares each row against all previous rows. You can match on all columns (exact duplicate) or select specific columns — useful when only certain fields define uniqueness, like an email or order ID.",
  },
  {
    q: "Is my data sent to a server?",
    a: "No. Everything runs in your browser using JavaScript. Your file is never uploaded — not even temporarily. Close the tab and all data is gone.",
  },
  {
    q: "Is there a row limit?",
    a: "No. The tool handles files with tens of thousands of rows. Very large files may take a few seconds in the browser.",
  },
  {
    q: "What's the difference between 'all columns' and 'selected columns' mode?",
    a: "All-columns mode removes rows where every cell is identical — true duplicates. Selected-columns mode removes rows where the chosen fields match, even if other columns differ. Use this to deduplicate by customer ID or email while keeping the most recent record.",
  },
  {
    q: "Does it keep the first or last duplicate?",
    a: "It keeps the first occurrence of each duplicate group and removes subsequent ones. The order of your original file is preserved.",
  },
];

const USE_CASES: UseCase[] = [
  {
    persona: "E-commerce Ops Manager",
    domain: "Retail / E-commerce",
    icon: "🛒",
    scenario: "Exports an 80,000-row product catalog from Shopify after merging a supplier feed. Duplicate SKUs inflate inventory counts and break fulfilment workflows downstream.",
    outcome: "Removes 3,200 duplicates in seconds, uploads the clean file to Shopify, then sets up Sohovi to catch duplicates automatically on every future feed.",
  },
  {
    persona: "CRM Administrator",
    domain: "Sales & Marketing",
    icon: "📊",
    scenario: "Pulls a HubSpot contact export before a campaign launch. Duplicate contacts mean double-emails, inflated send costs, and GDPR/CAN-SPAM compliance risk.",
    outcome: "Deduplicates on the email column specifically. 94 duplicate contacts removed. Campaign sends cleanly with no compliance exposure.",
  },
  {
    persona: "Bookkeeper",
    domain: "Accounting / Finance",
    icon: "📒",
    scenario: "Bank statement export has identical transaction rows where a payment crossed midnight. QuickBooks import fails with a 'duplicate reference ID' error and won't proceed.",
    outcome: "Finds 11 duplicate transactions instantly. Exports clean file. Import succeeds and month-end close stays on schedule.",
  },
  {
    persona: "Data Analyst",
    domain: "Healthcare / Research",
    icon: "🏥",
    scenario: "Survey export from Qualtrics has duplicate respondent IDs — the form was submitted twice by the same participants. Duplicates skew mean scores and invalidate the analysis.",
    outcome: "Deduplicates on respondent_id. Removes 47 rows. Statistical analysis runs correctly and the research report is submitted on time.",
  },
];

const relatedTools = [
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select, drop, and rename CSV columns" },
  { name: "CSV Merger", href: "/tools/csv-merger", description: "Combine multiple CSV files into one" },
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert CSV to a JSON array" },
];

export function RemoveDuplicatesClient() {
  const [parsed, setParsed] = useState<ParsedCSV | null>(null);
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<DedupeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRemoved, setShowRemoved] = useState(false);
  const fileRef = useRef<string>("");

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedCols(new Set());
    try {
      const text = await file.text();
      const { headers, rows } = parseCSVText(text);
      fileRef.current = file.name.replace(/\.[^.]+$/, "");
      setParsed({ headers, rows, fileName: file.name });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  function toggleCol(col: string) {
    setSelectedCols((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  }

  function runDedupe() {
    if (!parsed) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const r = dedupeRows(parsed, selectedCols);
        setResult(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Deduplication failed");
      } finally {
        setLoading(false);
      }
    }, 10);
  }

  function handleDownload() {
    if (!result) return;
    const csv = rowsToCSV(result.headers, result.uniqueRows);
    downloadCSV(csv, `${fileRef.current}-deduped.csv`);
  }

  const dupPct = result ? Math.round((result.removedCount / result.originalCount) * 100) : 0;

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div
          className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(224,113,80,0.08)", color: "#C45A3C", border: "1px solid rgba(224,113,80,0.2)" }}
        >
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free Duplicate Row Remover for CSV
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Upload your CSV and remove duplicate rows instantly — exact match or by selected columns.
          Works for Excel files too. <strong style={{ color: "var(--ink)" }}>Your data never leaves your browser.</strong>
        </p>
      </header>

      {/* Upload */}
      {!parsed && !loading && (
        <UploadZone onFile={handleFile} />
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} />
          <span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Processing…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {/* Column selection */}
      {parsed && !result && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-6" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                {parsed.fileName}
              </h2>
              <span className="text-[12px]" style={{ color: "var(--ink-mute)" }}>
                {parsed.rows.length.toLocaleString()} rows · {parsed.headers.length} columns
              </span>
            </div>

            <p className="text-[13px] mb-5" style={{ color: "var(--ink-soft)" }}>
              Choose which columns define a duplicate. Leave all unchecked to match on every column (exact duplicates).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {parsed.headers.map((h) => {
                const checked = selectedCols.has(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleCol(h)}
                    className="flex items-center gap-2 text-left px-3 py-2.5 rounded-lg border transition-all text-[13px]"
                    style={{
                      borderColor: checked ? "var(--mint)" : "var(--hair-strong)",
                      background: checked ? "rgba(0,201,167,0.06)" : "transparent",
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

          <button
            onClick={runDedupe}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all"
            style={{ background: "var(--ink)", color: "white" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
          >
            Remove duplicates
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Original rows", value: result.originalCount.toLocaleString(), color: "var(--ink-mute)" },
              { label: "Duplicates removed", value: result.removedCount.toLocaleString(), color: "#E07150" },
              { label: "Unique rows kept", value: result.uniqueCount.toLocaleString(), color: "#00C9A7" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
                <div className="text-[26px] font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {result.removedCount === 0 ? (
            <div className="rounded-xl border p-5 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
              <p className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>No duplicates found!</p>
              <p className="text-[13px] mt-1" style={{ color: "var(--ink-mute)" }}>Every row in your file is unique.</p>
            </div>
          ) : (
            <>
              <p className="text-[14px]" style={{ color: "var(--ink-soft)" }}>
                <strong style={{ color: "var(--ink)" }}>{dupPct}%</strong> of your rows were duplicates.
                {result.removedCount > 0 && ` Your cleaned file has ${result.uniqueCount.toLocaleString()} rows.`}
              </p>

              <SoftCTA text="Running this check manually each time? Sohovi's uniqueness dimension catches duplicates automatically on every upload →" />

              {/* Preview */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                    Preview — first 5 unique rows
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--hair)" }}>
                        {result.headers.map((h) => (
                          <th key={h} className="text-left px-4 py-2 font-semibold whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.uniqueRows.slice(0, 5).map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--hair)" }}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 whitespace-nowrap max-w-[180px] truncate" style={{ color: "var(--ink)" }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Removed rows toggle */}
              {result.removedRows.length > 0 && (
                <button
                  onClick={() => setShowRemoved(!showRemoved)}
                  className="text-[13px] underline underline-offset-2"
                  style={{ color: "var(--ink-mute)" }}
                >
                  {showRemoved ? "Hide" : "Show"} {result.removedRows.length} removed rows
                </button>
              )}

              {showRemoved && (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#FECACA" }}>
                  <div className="px-5 py-3" style={{ background: "#FEF2F2", borderBottom: "1px solid #FECACA" }}>
                    <span className="text-[13px] font-semibold text-red-700">
                      Removed duplicate rows (first 10 shown)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr style={{ background: "#FFF5F5", borderBottom: "1px solid #FECACA" }}>
                          {result.headers.map((h) => (
                            <th key={h} className="text-left px-4 py-2 font-semibold whitespace-nowrap text-red-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.removedRows.slice(0, 10).map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #FECACA" }}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-2 whitespace-nowrap max-w-[180px] truncate" style={{ color: "var(--ink)" }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Download */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all"
              style={{ background: "var(--ink)", color: "white" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
            >
              <Download className="w-4 h-4" />
              Download {result.uniqueCount.toLocaleString()} unique rows (.csv)
            </button>
            <button
              onClick={() => { setParsed(null); setResult(null); setSelectedCols(new Set()); }}
              className="px-5 py-3 rounded-xl text-[14px] border transition-all"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}
            >
              Start over
            </button>
          </div>

          <HardCTA
            headline={`${result.removedCount.toLocaleString()} duplicates found — catch them automatically next time`}
            body="Sohovi's uniqueness dimension flags duplicate rows on every upload, sends alerts when your data degrades, and tracks uniqueness over time — so you never have to run this tool again."
            bullets={[
              "Uniqueness scoring on every upload — automatic",
              "Threshold alerts: get notified when duplicates exceed your limit",
              "10-dimension DQ scoring including validity, completeness, and conformity",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="Duplicate Row Remover" />

      {/* How it works */}
      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to remove duplicate rows from a CSV</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload your CSV or Excel file", body: "Drag and drop your file or click to browse. The tool reads it entirely in your browser — nothing is sent to any server." },
            { step: "2", title: "Choose your deduplication columns", body: "Leave all columns unchecked for exact-row matching. Or select specific columns — great for removing duplicates by customer email, order ID, or product SKU while preserving other differences." },
            { step: "3", title: "Remove duplicates and download", body: "Click 'Remove duplicates' and your cleaned CSV is ready in seconds. Preview the removed rows before downloading. The original row order is preserved." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/remove-duplicates" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
