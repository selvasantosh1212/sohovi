"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Download, GripVertical, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

interface ColState {
  original: string;
  renamed: string;
  visible: boolean;
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

function rowsToCSV(headers: string[], rows: string[][], colIndices: number[]): string {
  const esc = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
  const hRow = colIndices.map((i) => esc(headers[i])).join(",");
  const dataRows = rows.map((r) => colIndices.map((i) => esc(r[i] ?? "")).join(","));
  return [hRow, ...dataRows].join("\n");
}

const faqs: FAQItem[] = [
  { q: "How do I extract specific columns from a CSV?", a: "Upload your CSV, then uncheck the columns you want to remove (or check only the ones you want to keep). Click Download to get the filtered CSV with only your selected columns." },
  { q: "Can I rename columns?", a: "Yes. Click on any column name to rename it inline. The renamed headers appear in the downloaded CSV." },
  { q: "Can I reorder columns?", a: "Yes. Drag the grip handle on the left of each column row to reorder them. The downloaded CSV reflects your new column order." },
  { q: "Is there a row limit?", a: "No. The tool processes your entire file in-browser. No rows are lost or truncated in the download." },
  { q: "What file formats are supported?", a: "CSV (.csv, .txt) and Excel (.xlsx, .xls). The tool reads the first sheet of Excel files." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Data Steward",
    domain: "Data Governance",
    icon: "🗂️",
    scenario: "Raw CRM export has 140 columns including PII — SSN, date of birth, salary. The analytics team only needs 12 business columns. Forwarding the full export would be a compliance breach.",
    outcome: "Drops 128 columns, renames internal field codes to human-readable headers, downloads the safe file. PII never touches the analytics team's inbox.",
  },
  {
    persona: "Compliance Officer",
    domain: "Legal / Compliance",
    icon: "⚖️",
    scenario: "Customer submits a GDPR Subject Access Request. The full export includes internal cost scores and risk flags the customer is legally not entitled to see.",
    outcome: "Selects only customer-facing columns, reorders them into a logical reading sequence. Clean file shared with confidence.",
  },
  {
    persona: "Sales Ops",
    domain: "B2B Sales",
    icon: "💼",
    scenario: "Salesforce export for a partner who only needs contact name, email, company, and deal stage. The 60-column export confuses the partner and slows the handoff.",
    outcome: "Picks 4 columns, renames 'Account_Name__c' to 'Company'. Sends a clean 4-column CSV. Partner onboarded same day.",
  },
  {
    persona: "HR Manager",
    domain: "Human Resources",
    icon: "👥",
    scenario: "Payroll export includes salary bands, bank details, and emergency contacts. An external consultant needs headcount data (name, department, start date) for an org design project.",
    outcome: "Picks 3 non-sensitive columns and downloads. Sensitive payroll data never leaves HR. Consultant gets exactly what they need.",
  },
];

const relatedTools = [
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove duplicate rows from CSV" },
  { name: "CSV Merger", href: "/tools/csv-merger", description: "Combine multiple CSV files into one" },
  { name: "CSV to JSON", href: "/tools/csv-to-json", description: "Convert CSV to a JSON array" },
];

export function CsvColumnsClient() {
  const [cols, setCols] = useState<ColState[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [originalHeaders, setOriginalHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  async function handleFile(file: File) {
    setLoading(true); setError(null); setDone(false);
    try {
      const text = await file.text();
      const { headers, rows: r } = parseCSVText(text);
      setOriginalHeaders(headers);
      setRows(r);
      setCols(headers.map((h) => ({ original: h, renamed: h, visible: true })));
      setFileName(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to parse file"); }
    finally { setLoading(false); }
  }

  function toggleVisible(i: number) {
    setCols((prev) => prev.map((c, idx) => idx === i ? { ...c, visible: !c.visible } : c));
  }

  function renameCol(i: number, name: string) {
    setCols((prev) => prev.map((c, idx) => idx === i ? { ...c, renamed: name } : c));
  }

  function handleDragStart(i: number) { setDragIdx(i); }
  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setCols((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(i);
  }

  function handleDownload() {
    const visible = cols.filter((c) => c.visible);
    const colIndices = visible.map((c) => originalHeaders.indexOf(c.original));
    const renamedHeaders = visible.map((c) => c.renamed);
    const esc = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
    const csv = [
      renamedHeaders.map(esc).join(","),
      ...rows.map((r) => colIndices.map((i) => esc(r[i] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${fileName}-columns.csv`; a.click();
    URL.revokeObjectURL(url);
    setDone(true);
  }

  const visibleCount = cols.filter((c) => c.visible).length;

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(199,189,230,0.12)", color: "#6B5EA8", border: "1px solid rgba(199,189,230,0.4)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free CSV Column Picker
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Select columns to keep, drop what you don&apos;t need, rename headers, and reorder — then download your filtered CSV.
          <strong style={{ color: "var(--ink)" }}> Your file never leaves your browser.</strong>
        </p>
      </header>

      {!cols.length && !loading && <UploadZone onFile={handleFile} />}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} />
          <span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Reading file…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {cols.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[14px]" style={{ color: "var(--ink-soft)" }}>
              {visibleCount} of {cols.length} columns selected · {rows.length.toLocaleString()} rows
            </p>
            <div className="flex gap-2">
              <button onClick={() => setCols((p) => p.map((c) => ({ ...c, visible: true })))} className="text-[12px] px-3 py-1.5 rounded-lg border transition-all" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-mute)" }}>
                Select all
              </button>
              <button onClick={() => setCols((p) => p.map((c) => ({ ...c, visible: false })))} className="text-[12px] px-3 py-1.5 rounded-lg border transition-all" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-mute)" }}>
                Deselect all
              </button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider" style={{ background: "var(--cream-deep)", color: "var(--ink-mute)", borderBottom: "1px solid var(--hair)" }}>
              Drag to reorder · Click eye to hide · Click name to rename
            </div>
            <div>
              {cols.map((col, i) => (
                <div
                  key={col.original}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={() => setDragIdx(null)}
                  className="flex items-center gap-3 px-4 py-3 border-b transition-all"
                  style={{
                    borderColor: "var(--hair)",
                    background: dragIdx === i ? "rgba(0,201,167,0.04)" : col.visible ? "var(--paper)" : "var(--cream)",
                    opacity: col.visible ? 1 : 0.5,
                  }}
                >
                  <GripVertical className="w-4 h-4 shrink-0 cursor-grab" style={{ color: "var(--ink-mute)" }} />
                  <button onClick={() => toggleVisible(i)} className="shrink-0">
                    {col.visible
                      ? <Eye className="w-4 h-4" style={{ color: "#00C9A7" }} />
                      : <EyeOff className="w-4 h-4" style={{ color: "var(--ink-mute)" }} />}
                  </button>
                  <input
                    value={col.renamed}
                    onChange={(e) => renameCol(i, e.target.value)}
                    className="flex-1 text-[13px] bg-transparent border-0 focus:outline-none font-medium"
                    style={{ color: col.visible ? "var(--ink)" : "var(--ink-mute)" }}
                  />
                  {col.renamed !== col.original && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "rgba(0,201,167,0.08)", color: "#007A65" }}>renamed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <SoftCTA text="Selecting columns manually each time this data refreshes? Sohovi enforces column-level quality rules automatically →" />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              disabled={visibleCount === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all disabled:opacity-40"
              style={{ background: "var(--ink)", color: "white" }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
            >
              <Download className="w-4 h-4" />
              Download {visibleCount} column{visibleCount !== 1 ? "s" : ""} ({rows.length.toLocaleString()} rows)
            </button>
            <button onClick={() => { setCols([]); setRows([]); setDone(false); }} className="px-5 py-3 rounded-xl text-[14px] border" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
              Start over
            </button>
          </div>

          {done && (
            <HardCTA
              headline="Selecting columns manually every time? Sohovi automates that."
              body="Define which columns matter, set quality rules per column, and get alerts when data degrades — automatically on every upload. No manual column work ever again."
              bullets={[
                "Per-column DQ rules: type constraints, format checks, null thresholds",
                "Column-level profiling on every upload — instant visibility",
                "Alerts when a column's quality drops below your threshold",
              ]}
            />
          )}
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="CSV Column Picker" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to extract or remove columns from a CSV</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload your CSV file", body: "Drop your file or click to browse. The tool reads it entirely in your browser. No data is sent anywhere." },
            { step: "2", title: "Configure your columns", body: "Toggle visibility with the eye icon, rename by clicking the column name, drag the grip handle to reorder. Changes are live — the column list reflects your final output." },
            { step: "3", title: "Download your filtered CSV", body: "Click Download to get your file with only the selected columns, in your chosen order, with your new names. All rows are preserved." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/csv-columns" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
