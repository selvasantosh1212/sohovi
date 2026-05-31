"use client";

import { useState } from "react";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Upload, Trash2, Download, AlertCircle } from "lucide-react";

interface ParsedFile {
  name: string;
  headers: string[];
  rows: string[][];
}

function parseCSVText(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("File is empty");
  const parse = (line: string): string[] => {
    const result: string[] = []; let cur = "", inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQuote && line[i + 1] === '"') { cur += '"'; i++; } else inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { result.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    result.push(cur.trim()); return result;
  };
  return { headers: parse(lines[0]), rows: lines.slice(1).map(parse) };
}

function stackMerge(files: ParsedFile[]): { headers: string[]; rows: string[][] } {
  const allHeaders = Array.from(new Set(files.flatMap((f) => f.headers)));
  const rows: string[][] = [];
  for (const file of files) {
    for (const row of file.rows) {
      rows.push(allHeaders.map((h) => {
        const i = file.headers.indexOf(h);
        return i === -1 ? "" : (row[i] ?? "");
      }));
    }
  }
  return { headers: allHeaders, rows };
}

function rowsToCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

const faqs: FAQItem[] = [
  { q: "How do I merge multiple CSV files into one?", a: "Upload your CSV files using the tool (you can add up to 10). The Stack mode appends all rows into one file — it unions column headers from all files so no data is lost even if schemas differ. Missing values for columns that don't exist in a particular file are left blank." },
  { q: "What happens if my CSV files have different columns?", a: "In Stack mode, the tool unions all column headers across all files. Each row gets blank values for columns that didn't exist in its source file. This gives you a complete merged file with no data lost." },
  { q: "Is there a file size or row count limit?", a: "No. The tool runs entirely in your browser and can handle files with hundreds of thousands of rows. Very large files may take a few seconds to process." },
  { q: "Are the rows from different files kept in order?", a: "Yes. In Stack mode, rows from each file are appended in the order you uploaded the files. Rows within each file keep their original order." },
  { q: "Can I merge Excel files too?", a: "The tool currently accepts CSV files. To merge Excel files, first convert them to CSV using a tool like Excel or Google Sheets, then upload here." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Operations Manager",
    domain: "Logistics / Operations",
    icon: "🏭",
    scenario: "Twelve regional teams submit weekly activity reports as separate CSV files. Consolidating them in Excel every Monday means 2 hours of open-copy-paste-fix cycles, often with header mismatches between regions.",
    outcome: "Uploads all 12 files. Schema-union mode handles the 2 teams with extra columns. Downloads the merged file in 15 seconds. Monday morning reclaimed.",
  },
  {
    persona: "Finance Manager",
    domain: "Finance / Accounting",
    icon: "💰",
    scenario: "Q1 expenses are split across three CSV exports — January, February, and March — from the expense management platform. The auditor needs a single consolidated file.",
    outcome: "Stacks 3 files. 4,800 combined expense rows. Downloads one clean CSV. Audit-ready in under a minute.",
  },
  {
    persona: "Market Research Analyst",
    domain: "Market Research",
    icon: "🔍",
    scenario: "Survey platform exports responses in monthly batches as separate CSVs. A cross-month trend analysis requires one unified dataset, but questions were added mid-year so schemas differ.",
    outcome: "Merges 6 monthly files. Column-union mode fills missing answers with blanks for consistency. SPSS-ready dataset in minutes, not hours.",
  },
  {
    persona: "Sales Analyst",
    domain: "B2B Sales",
    icon: "📋",
    scenario: "CRM exports active deals split by region — North, South, East, West — as four separate CSVs. The board wants a single pipeline report across all territories.",
    outcome: "Merges all 4 files. 2,100 combined deal rows. Pivot table built on the merged CSV. Board report ready before the Monday meeting.",
  },
];

const relatedTools = [
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove duplicates after merging" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Keep only the columns you need" },
  { name: "CSV to JSON", href: "/tools/csv-to-json", description: "Convert the merged CSV to JSON" },
];

export function CsvMergerClient() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    const parsed: ParsedFile[] = [];
    for (const file of selected) {
      try {
        const text = await file.text();
        const { headers, rows } = parseCSVText(text);
        parsed.push({ name: file.name, headers, rows });
      } catch (err) {
        setError(`Failed to parse ${file.name}: ${err instanceof Error ? err.message : "unknown error"}`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...parsed].slice(0, 10));
    setResult(null);
    setError(null);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  }

  function handleMerge() {
    if (files.length < 2) { setError("Upload at least 2 files to merge"); return; }
    setError(null);
    const w: string[] = [];
    const allHeaders = new Set(files.flatMap((f) => f.headers));
    for (const file of files) {
      const missing = [...allHeaders].filter((h) => !file.headers.includes(h));
      if (missing.length > 0) w.push(`${file.name} is missing columns: ${missing.join(", ")} (filled with blanks)`);
    }
    setWarnings(w);
    setResult(stackMerge(files));
  }

  function handleDownload() {
    if (!result) return;
    const csv = rowsToCSV(result.headers, result.rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "merged.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const totalRows = files.reduce((s, f) => s + f.rows.length, 0);

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(168,200,166,0.12)", color: "#3A7A38", border: "1px solid rgba(168,200,166,0.4)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free CSV Merger — Combine Multiple CSV Files
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Upload up to 10 CSV files and merge them into one — stack rows together, even if schemas differ.
          <strong style={{ color: "var(--ink)" }}> No upload to servers. No signup. No limits.</strong>
        </p>
      </header>

      {/* File list */}
      <div className="space-y-4">
        {files.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider" style={{ background: "var(--cream-deep)", color: "var(--ink-mute)", borderBottom: "1px solid var(--hair)" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} · {totalRows.toLocaleString()} total rows
            </div>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "var(--ink)" }}>{f.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>
                    {f.rows.length.toLocaleString()} rows · {f.headers.length} columns
                  </p>
                </div>
                <button onClick={() => removeFile(i)} className="p-2 rounded-lg transition-all" style={{ color: "var(--ink-mute)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length < 10 && (
          <label className="cursor-pointer flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 px-6 transition-all" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <Upload className="w-5 h-5" style={{ color: "var(--ink-mute)" }} />
            <span className="text-[14px] font-medium" style={{ color: "var(--ink-soft)" }}>
              {files.length === 0 ? "Click to add CSV files" : "Add more files (up to 10 total)"}
            </span>
            <input type="file" accept=".csv,.txt" multiple className="hidden" onChange={handleFiles} />
          </label>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <p className="text-[14px] text-red-700">{error}</p>
          </div>
        )}

        {files.length >= 2 && !result && (
          <button onClick={handleMerge} className="w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all" style={{ background: "var(--ink)", color: "white" }}>
            Merge {files.length} files
          </button>
        )}
      </div>

      {result && (
        <div className="space-y-5 mt-6">
          {warnings.length > 0 && (
            <div className="rounded-xl border p-4 space-y-1" style={{ borderColor: "#FDE68A", background: "#FFFBEB" }}>
              {warnings.map((w, i) => (
                <p key={i} className="text-[13px] text-amber-700">{w}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Files merged", value: files.length.toString(), color: "#00C9A7" },
              { label: "Total rows", value: result.rows.length.toLocaleString(), color: "#00C9A7" },
              { label: "Columns", value: result.headers.length.toString(), color: "var(--ink-mute)" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
                <div className="text-[26px] font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>Preview — first 5 rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--hair)" }}>
                    {result.headers.slice(0, 8).map((h) => (
                      <th key={h} className="text-left px-4 py-2 font-semibold whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{h}</th>
                    ))}
                    {result.headers.length > 8 && <th className="px-4 py-2 text-left" style={{ color: "var(--ink-mute)" }}>+{result.headers.length - 8} more</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--hair)" }}>
                      {row.slice(0, 8).map((cell, j) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap max-w-[160px] truncate" style={{ color: "var(--ink)" }}>{cell}</td>
                      ))}
                      {row.length > 8 && <td className="px-4 py-2" style={{ color: "var(--ink-mute)" }}>…</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SoftCTA text="Merged data from multiple sources often inherits quality problems — Sohovi detects them automatically →" />

          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all" style={{ background: "var(--ink)", color: "white" }}>
              <Download className="w-4 h-4" />
              Download merged.csv ({result.rows.length.toLocaleString()} rows)
            </button>
            <button onClick={() => { setFiles([]); setResult(null); setWarnings([]); }} className="px-5 py-3 rounded-xl text-[14px] border" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
              Start over
            </button>
          </div>

          <HardCTA
            headline={`${result.rows.length.toLocaleString()} rows merged — now check if the combined data is actually clean`}
            body="Merged datasets often inherit quality issues from each source file. Sohovi profiles your combined data automatically — catching nulls, type inconsistencies, and duplicates before they cause downstream problems."
            bullets={[
              "Null rate and completeness profile on every column",
              "Duplicate detection across the merged dataset",
              "Track quality over time as new files are added",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="CSV Merger" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to merge multiple CSV files into one</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload your CSV files", body: "Click to add your files — you can upload up to 10 at once. Each file is read locally in your browser. Nothing is uploaded to a server." },
            { step: "2", title: "Review the file list", body: "Each uploaded file shows its row count and column count. Remove any file by clicking the trash icon. The tool warns you if schemas differ between files." },
            { step: "3", title: "Merge and download", body: "Click Merge to combine all files. Rows are stacked in upload order. Missing columns across files are filled with blank values. Download the merged CSV instantly." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>{s.step}</div>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{s.title}</p>
                <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/csv-merger" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
