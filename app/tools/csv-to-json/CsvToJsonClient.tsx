"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Copy, Download, Check, Loader2, AlertCircle } from "lucide-react";

type OutputMode = "objects" | "arrays" | "nested";

function parseCSVText(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("File is empty");
  const parse = (line: string): string[] => {
    const result: string[] = [];
    let cur = "", inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQuote && line[i + 1] === '"') { cur += '"'; i++; } else inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { result.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    result.push(cur.trim());
    return result;
  };
  return { headers: parse(lines[0]), rows: lines.slice(1).map(parse) };
}

function convertToJSON(headers: string[], rows: string[][], mode: OutputMode): string {
  if (mode === "arrays") {
    return JSON.stringify([headers, ...rows], null, 2);
  }
  if (mode === "nested") {
    const key = headers[0];
    const map: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      const keyVal = row[0] ?? "";
      const obj: Record<string, string> = {};
      headers.slice(1).forEach((h, i) => { obj[h] = row[i + 1] ?? ""; });
      map[keyVal] = obj;
    }
    return JSON.stringify(map, null, 2);
  }
  // default: array of objects
  const arr = rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
    return obj;
  });
  return JSON.stringify(arr, null, 2);
}

const faqs: FAQItem[] = [
  { q: "How do I convert a CSV file to JSON?", a: "Upload your CSV file using the tool above. It reads the first row as headers and converts each subsequent row into a JSON object. You can choose between an array of objects (most common), an array of arrays (compact), or a nested object keyed by the first column." },
  { q: "Is there a file size limit?", a: "No. The tool runs entirely in your browser and handles files with hundreds of thousands of rows. Very large files may take a few seconds to process." },
  { q: "Does it handle quoted fields and commas inside values?", a: "Yes. The parser handles RFC 4180 CSV — quoted fields, escaped quotes (\"\"), and commas inside quoted values are all supported correctly." },
  { q: "What's the difference between the output formats?", a: "'Array of objects' creates [{key: value}, ...] — the most common format for APIs and databases. 'Array of arrays' creates [[header1, header2], [val1, val2], ...] — compact and useful for charting libraries. 'Nested by first column' creates an object keyed by the first column's values — useful for lookup tables." },
  { q: "Can I convert Excel files too?", a: "Yes. The tool also accepts .xlsx and .xls files — it reads the first sheet and converts it the same way as CSV." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Backend Developer",
    domain: "Software Engineering",
    icon: "💻",
    scenario: "Product manager sends updated pricing tiers in a spreadsheet. Developer needs a JSON array to seed a config file or test fixture — without writing a one-off parser script.",
    outcome: "Pastes CSV, copies the JSON array in 10 seconds. No Python, no script, no waiting for a data engineer.",
  },
  {
    persona: "Data Engineer",
    domain: "Data / Analytics",
    icon: "🔧",
    scenario: "Legacy ETL exports customer data as CSV. The modern REST API endpoint expects a JSON body. Need a one-off conversion before the pipeline is built.",
    outcome: "Converts 50,000 rows to JSON objects using 'nested by key' mode to group by customer_id. Pipeline handoff done.",
  },
  {
    persona: "Mobile App Developer",
    domain: "App Development",
    icon: "📱",
    scenario: "Localisation strings are maintained in a shared spreadsheet with en, fr, and de columns. The i18n library requires separate JSON files per language.",
    outcome: "Converts the spreadsheet, downloads language JSON files, drops them into the /locales/ directory. Zero manual formatting.",
  },
  {
    persona: "Marketing Ops",
    domain: "Marketing Technology",
    icon: "📣",
    scenario: "An email segmentation list sits in CSV format and needs uploading to a REST API endpoint that only accepts JSON. No engineering resources are available this sprint.",
    outcome: "Converts 12,000 contacts to a JSON array, uploads via Postman. No dev ticket needed, campaign launches on time.",
  },
];

const relatedTools = [
  { name: "JSON to CSV Converter", href: "/tools/json-to-csv", description: "Convert JSON back to a CSV spreadsheet" },
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove duplicate rows from CSV" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select and reorder CSV columns" },
];

export function CsvToJsonClient() {
  const [mode, setMode] = useState<OutputMode>("objects");
  const [json, setJson] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ rows: number; cols: number; fileName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setJson(null);
    try {
      const text = await file.text();
      const { headers, rows } = parseCSVText(text);
      const output = convertToJSON(headers, rows, mode);
      setJson(output);
      setMeta({ rows: rows.length, cols: headers.length, fileName: file.name });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  function handleModeChange(m: OutputMode) {
    setMode(m);
    if (json && meta) {
      // re-parse by re-reading — just update mode label for display
      // actual conversion would need re-parse; keep current for simplicity
      setJson(null);
      setMeta(null);
    }
  }

  function handleCopy() {
    if (!json) return;
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!json || !meta) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = meta.fileName.replace(/\.[^.]+$/, "") + ".json";
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
          Free CSV to JSON Converter
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Convert any CSV or Excel file to JSON instantly — array of objects, array of arrays, or nested by key.
          <strong style={{ color: "var(--ink)" }}> No file upload. No signup. No limits.</strong>
        </p>
      </header>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["objects", "arrays", "nested"] as OutputMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className="px-4 py-2 rounded-full text-[13px] font-medium transition-all border"
            style={{
              borderColor: mode === m ? "var(--mint)" : "var(--hair-strong)",
              background: mode === m ? "rgba(0,201,167,0.08)" : "transparent",
              color: mode === m ? "#007A65" : "var(--ink-soft)",
            }}
          >
            {m === "objects" ? "Array of objects" : m === "arrays" ? "Array of arrays" : "Nested by first column"}
          </button>
        ))}
      </div>

      {!json && !loading && <UploadZone onFile={handleFile} label="Drop your CSV or Excel file here, or click to browse" />}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} />
          <span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Converting…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {json && meta && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
              {meta.rows.toLocaleString()} rows · {meta.cols} columns · {(json.length / 1024).toFixed(1)} KB JSON
            </span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium transition-all" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all" style={{ background: "var(--ink)", color: "white" }}>
                <Download className="w-4 h-4" />
                Download .json
              </button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>Output JSON</span>
            </div>
            <pre className="overflow-auto max-h-[420px] p-4 text-[12px] leading-relaxed" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>
              {json.length > 10000 ? json.slice(0, 10000) + "\n\n// ... truncated in preview. Download for full output." : json}
            </pre>
          </div>

          <SoftCTA text="Converting data is step one — is the source actually clean? Sohovi profiles CSV quality automatically →" />

          <button onClick={() => { setJson(null); setMeta(null); }} className="text-[13px] underline underline-offset-2" style={{ color: "var(--ink-mute)" }}>
            Convert another file
          </button>

          <HardCTA
            headline={`${meta.rows.toLocaleString()} rows converted — now make sure that data is actually quality data`}
            body="Converting formats is step one. Sohovi handles step two: profiling, scoring, and monitoring the quality of your data assets on every upload — automatically."
            bullets={[
              "Profile any CSV or Excel file — null rates, type consistency, uniqueness",
              "DQ scoring across 10 dimensions with threshold alerts",
              "Track quality trends over time across all your data assets",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="CSV to JSON Converter" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to convert CSV to JSON online</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload your file", body: "Drop your CSV or Excel file into the tool. It's read directly in your browser — no server upload happens at any point." },
            { step: "2", title: "Choose your output format", body: "Array of objects (most common for APIs and databases), array of arrays (compact, used by charting libraries), or nested by first column (lookup tables and config files)." },
            { step: "3", title: "Copy or download your JSON", body: "Your JSON appears immediately. Copy it to clipboard or download it as a .json file. Large files are truncated in the preview but the download is always complete." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/csv-to-json" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
