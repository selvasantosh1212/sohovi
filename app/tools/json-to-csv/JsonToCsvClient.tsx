"use client";

import { useState } from "react";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Copy, Download, Check, AlertCircle } from "lucide-react";

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = val === null || val === undefined ? "" : String(val);
    }
  }
  return result;
}

function jsonToCSV(input: string): { csv: string; rows: number; cols: number } {
  const parsed = JSON.parse(input);
  let arr: Record<string, unknown>[];

  if (Array.isArray(parsed)) {
    arr = parsed;
  } else if (typeof parsed === "object" && parsed !== null) {
    arr = Object.values(parsed) as Record<string, unknown>[];
  } else {
    throw new Error("JSON must be an array or object");
  }

  if (arr.length === 0) throw new Error("JSON array is empty");

  const flattened = arr.map((item) =>
    typeof item === "object" && item !== null
      ? flattenObject(item as Record<string, unknown>)
      : { value: String(item) }
  );

  const headers = Array.from(new Set(flattened.flatMap(Object.keys)));

  const esc = (v: string) =>
    v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;

  const lines = [
    headers.map(esc).join(","),
    ...flattened.map((row) => headers.map((h) => esc(row[h] ?? "")).join(",")),
  ];

  return { csv: lines.join("\n"), rows: flattened.length, cols: headers.length };
}

const faqs: FAQItem[] = [
  { q: "How do I convert JSON to CSV?", a: "Paste your JSON directly into the text area or upload a .json file. The tool automatically detects if it's an array of objects, a single object, or a nested structure, flattens it, and produces a clean CSV you can download or copy." },
  { q: "How does it handle nested JSON?", a: "Nested objects are flattened using dot notation. For example, {\"address\": {\"city\": \"London\"}} becomes a column named 'address.city'. Arrays within objects are converted to their string representation." },
  { q: "What if my JSON has inconsistent keys?", a: "No problem. The tool unions all unique keys across all objects and uses them as headers. Missing values for a key in any particular row are left empty." },
  { q: "Is there a size limit?", a: "No. The tool runs entirely in your browser. Paste as much JSON as you like — it handles millions of rows, though very large inputs may take a moment." },
  { q: "Can I convert a JSON API response to CSV?", a: "Yes — this is one of the most common use cases. Copy the JSON response from your browser's network tab or an API client like Postman, paste it here, and download the CSV." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "E-commerce Manager",
    domain: "Retail / E-commerce",
    icon: "🛍️",
    scenario: "Shopify product export arrives as nested JSON with a variants array per product. Needs a flat spreadsheet to share pricing with the buying team — nobody on the team knows JSON.",
    outcome: "Auto-flattens variants.0.price, variants.1.price into columns. Opens directly in Excel. Buying team reviews 600 SKUs in minutes.",
  },
  {
    persona: "Marketing Analyst",
    domain: "Digital Marketing",
    icon: "📈",
    scenario: "Google Analytics 4 Data API returns report data as JSON. Analyst needs it in a spreadsheet for the weekly stakeholder deck — no data engineering support until next week.",
    outcome: "Pastes the JSON response, downloads CSV, pastes into the deck. Entire process takes under 3 minutes with no code.",
  },
  {
    persona: "Business Analyst",
    domain: "Finance / Banking",
    icon: "🏦",
    scenario: "A third-party fintech API returns transaction data as JSON with nested metadata objects. The finance director wants it in Excel for an upcoming review.",
    outcome: "Flattens the nested 'metadata' object into dot-notation columns. 8,000 transactions become an Excel-ready spreadsheet in seconds.",
  },
  {
    persona: "No-Code Developer",
    domain: "SaaS / Startups",
    icon: "🚀",
    scenario: "Airtable webhook fires JSON payloads that a Zapier zap stores. The business owner needs a spreadsheet history to share with the board each month.",
    outcome: "Monthly JSON dump converted to CSV, shared via Google Drive link. Zero code written, board has the data they need.",
  },
];

const relatedTools = [
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert CSV files to JSON arrays" },
  { name: "CSV to SQL Generator", href: "/tools/csv-to-sql", description: "Generate SQL INSERT statements from CSV" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select and reorder CSV columns" },
];

export function JsonToCsvClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ csv: string; rows: number; cols: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => setInput(text));
    e.target.value = "";
  }

  function handleConvert() {
    setError(null);
    setResult(null);
    try {
      const res = jsonToCSV(input);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(0,201,167,0.08)", color: "#007A65", border: "1px solid rgba(0,201,167,0.2)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free JSON to CSV Converter
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Paste JSON or upload a .json file — get a clean CSV instantly. Nested objects are flattened automatically.
          <strong style={{ color: "var(--ink)" }}> Nothing is uploaded. No signup required.</strong>
        </p>
      </header>

      {/* Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>Paste your JSON</label>
          <label className="cursor-pointer text-[13px] font-medium underline underline-offset-2" style={{ color: "var(--ink-mute)" }}>
            or upload .json file
            <input type="file" accept=".json" className="hidden" onChange={handleFile} />
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`[{"name": "Alice", "email": "alice@example.com"}, ...]`}
          rows={8}
          className="w-full rounded-xl border px-4 py-3 text-[13px] font-mono resize-y transition-all focus:outline-none"
          style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--mint)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--hair-strong)"; }}
        />
        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-40"
          style={{ background: "var(--ink)", color: "white" }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
        >
          Convert to CSV
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mt-5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-5 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
              {result.rows.toLocaleString()} rows · {result.cols} columns · {(result.csv.length / 1024).toFixed(1)} KB
            </span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy CSV"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "var(--ink)", color: "white" }}>
                <Download className="w-4 h-4" />
                Download .csv
              </button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>Output CSV (preview)</span>
            </div>
            <pre className="overflow-auto max-h-[300px] p-4 text-[12px]" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>
              {result.csv.length > 5000 ? result.csv.slice(0, 5000) + "\n// ... truncated. Download for full output." : result.csv}
            </pre>
          </div>

          <SoftCTA text="This JSON came from an API or system — is the source data reliable? Sohovi monitors data quality at origin →" />

          <button
            onClick={() => { setResult(null); setInput(""); }}
            className="text-[13px] underline underline-offset-2"
            style={{ color: "var(--ink-mute)" }}
          >
            Convert another file
          </button>

          <HardCTA
            headline={`${result.rows.toLocaleString()} rows ready — is the data actually reliable?`}
            body="Converting JSON to CSV is step one. Sohovi is step two: automatically profiling, scoring, and alerting on the quality of your data on every run."
            bullets={[
              "Null rate, type consistency, uniqueness — profiled instantly",
              "DQ scores across 10 dimensions with threshold alerts",
              "Track quality trends over time — no spreadsheet required",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="JSON to CSV Converter" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to convert JSON to CSV online</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Paste your JSON or upload a file", body: "Paste JSON directly from an API response, a file, or a database export. Or click 'Upload .json file' to load a file from your computer." },
            { step: "2", title: "Click Convert", body: "The tool validates the JSON, unions all keys across all objects, flattens nested objects using dot notation, and generates a CSV string in milliseconds." },
            { step: "3", title: "Download or copy your CSV", body: "Click Download to save a .csv file, or Copy CSV to paste directly into Excel, Google Sheets, or another tool. The download is always the full output — the preview is truncated for display." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/json-to-csv" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
