"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Copy, Check, AlertCircle, Loader2 } from "lucide-react";

type Align = "left" | "center" | "right";

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

function toMarkdown(headers: string[], rows: string[][], aligns: Align[], maxLen: number): string {
  const esc = (v: string) => v.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const trunc = (v: string) => v.length > maxLen ? v.slice(0, maxLen) + "…" : v;
  const cell = (v: string) => esc(trunc(v));

  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? "").slice(0, maxLen).length), 3)
  );

  const pad = (v: string, w: number, align: Align) => {
    const s = cell(v);
    if (align === "right") return s.padStart(w);
    if (align === "center") { const p = Math.max(0, w - s.length); return " ".repeat(Math.floor(p / 2)) + s + " ".repeat(Math.ceil(p / 2)); }
    return s.padEnd(w);
  };

  const sep = (w: number, align: Align) => {
    if (align === "center") return ":" + "-".repeat(w - 2) + ":";
    if (align === "right") return "-".repeat(w - 1) + ":";
    return "-".repeat(w);
  };

  const hRow = "| " + headers.map((h, i) => pad(h, colWidths[i], aligns[i])).join(" | ") + " |";
  const sepRow = "| " + colWidths.map((w, i) => sep(w, aligns[i])).join(" | ") + " |";
  const dataRows = rows.map((r) => "| " + headers.map((_, i) => pad(r[i] ?? "", colWidths[i], aligns[i])).join(" | ") + " |");

  return [hRow, sepRow, ...dataRows].join("\n");
}

const faqs: FAQItem[] = [
  { q: "How do I convert a CSV to a Markdown table?", a: "Upload your CSV file or paste the CSV text. The tool reads the first row as headers and converts each subsequent row into a Markdown table row. You can control column alignment (left, center, right) and truncate long cells." },
  { q: "What is GitHub-flavored Markdown (GFM)?", a: "GitHub-flavored Markdown is the dialect of Markdown used on GitHub, GitLab, and many documentation tools. GFM tables use pipe characters (|) as column separators and require a separator row after the header with dashes and optional colons for alignment." },
  { q: "How do I set column alignment?", a: "Use the alignment toggles above the output. Left alignment (default) uses dashes only. Center alignment adds colons on both sides (:---:). Right alignment adds a colon on the right (---:)." },
  { q: "Can I paste CSV text instead of uploading a file?", a: "Yes. Click 'Paste CSV text' to switch to a text area where you can paste directly. Useful for small tables you're copying from a spreadsheet." },
  { q: "Does it work for large files?", a: "Yes — there's no row limit. The output is truncated in the browser preview for performance, but the Copy button always gives you the full table." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Open Source Developer",
    domain: "Software / Open Source",
    icon: "🐙",
    scenario: "Benchmark results from a performance test suite are stored in CSV. The GitHub README needs a comparison table. Formatting Markdown manually for 12 rows × 5 columns takes 20 minutes and is error-prone when numbers change.",
    outcome: "Uploads CSV, right-aligns the numeric columns, copies Markdown. README updated and pushed in under 2 minutes.",
  },
  {
    persona: "Technical Writer",
    domain: "Developer Documentation",
    icon: "✍️",
    scenario: "API response fields are documented in a shared spreadsheet. The docs site uses Markdown. Every time a field is added, the table has to be manually reformatted — a tedious, error-prone process.",
    outcome: "Re-uploads the updated CSV whenever the spec changes. New Markdown copied into the doc in 30 seconds. Documentation stays in sync.",
  },
  {
    persona: "Product Manager",
    domain: "Product Management",
    icon: "🗺️",
    scenario: "A feature comparison matrix lives in Google Sheets. Stakeholders want it embedded in the Confluence wiki. Typing Confluence table markup row by row is tedious and easy to misalign.",
    outcome: "Exports from Sheets, converts to Markdown, pastes into Confluence. Table renders perfectly. Stakeholders review and approve same day.",
  },
  {
    persona: "Data Journalist",
    domain: "Media / Journalism",
    icon: "📰",
    scenario: "A dataset of 30 cities with population and economic statistics needs to appear as a table in an article. The CMS supports Markdown but formatting 30 rows manually on deadline is impractical.",
    outcome: "Uploads CSV, truncates long cell values at 40 characters, copies the table. Article published with clean data on time.",
  },
];

const relatedTools = [
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert CSV files to JSON arrays" },
  { name: "CSV to SQL Generator", href: "/tools/csv-to-sql", description: "Generate SQL INSERT statements from CSV" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select and reorder CSV columns" },
];

export function CsvToMarkdownClient() {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [pastedCSV, setPastedCSV] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [aligns, setAligns] = useState<Align[]>([]);
  const [maxLen, setMaxLen] = useState(80);
  const [md, setMd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function process(text: string) {
    try {
      const { headers: h, rows: r } = parseCSVText(text);
      setHeaders(h);
      setRows(r);
      setAligns(h.map(() => "left" as Align));
      const output = toMarkdown(h, r, h.map(() => "left"), maxLen);
      setMd(output);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse");
      setMd(null);
    }
  }

  async function handleFile(file: File) {
    setLoading(true);
    try { const text = await file.text(); process(text); }
    finally { setLoading(false); }
  }

  function handlePasteConvert() { process(pastedCSV); }

  function updateAlign(i: number, a: Align) {
    const next = aligns.map((v, idx) => idx === i ? a : v);
    setAligns(next);
    if (headers.length) setMd(toMarkdown(headers, rows, next, maxLen));
  }

  function handleCopy() {
    if (!md) return;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(247,214,122,0.1)", color: "#8A6A00", border: "1px solid rgba(247,214,122,0.4)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free CSV to Markdown Table Converter
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Convert any CSV to a GitHub-flavored Markdown table instantly. Control alignment per column, truncate long values, and copy with one click.
          <strong style={{ color: "var(--ink)" }}> No signup. No upload.</strong>
        </p>
      </header>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {(["upload", "paste"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="px-4 py-2 rounded-full text-[13px] font-medium border transition-all" style={{ borderColor: mode === m ? "#F7D67A" : "var(--hair-strong)", background: mode === m ? "rgba(247,214,122,0.1)" : "transparent", color: mode === m ? "#8A6A00" : "var(--ink-soft)" }}>
            {m === "upload" ? "Upload CSV file" : "Paste CSV text"}
          </button>
        ))}
      </div>

      {mode === "upload" && !md && !loading && <UploadZone onFile={handleFile} />}
      {mode === "paste" && !md && (
        <div className="space-y-3">
          <textarea value={pastedCSV} onChange={(e) => setPastedCSV(e.target.value)} placeholder={"name,role,team\nAlice,Engineer,Backend\nBob,Designer,Product"} rows={6} className="w-full rounded-xl border px-4 py-3 text-[13px] font-mono resize-y focus:outline-none" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }} />
          <button onClick={handlePasteConvert} disabled={!pastedCSV.trim()} className="w-full py-3 rounded-xl font-semibold text-[14px] disabled:opacity-40" style={{ background: "var(--ink)", color: "white" }}>Convert to Markdown</button>
        </div>
      )}

      {loading && <div className="flex items-center justify-center gap-3 py-16"><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} /><span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Converting…</span></div>}
      {error && <div className="flex items-center gap-3 p-4 rounded-xl mt-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-[14px] text-red-700">{error}</p></div>}

      {md && headers.length > 0 && (
        <div className="space-y-5">
          {/* Column alignment */}
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--ink)" }}>Column alignment</p>
            <div className="flex flex-wrap gap-2">
              {headers.map((h, i) => (
                <div key={h} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5" style={{ borderColor: "var(--hair)", background: "var(--cream)" }}>
                  <span className="text-[12px] font-medium mr-1" style={{ color: "var(--ink-soft)" }}>{h}</span>
                  {(["left", "center", "right"] as Align[]).map((a) => (
                    <button key={a} onClick={() => updateAlign(i, a)} className="text-[11px] px-2 py-0.5 rounded transition-all" style={{ background: aligns[i] === a ? "#F7D67A" : "transparent", color: aligns[i] === a ? "#8A6A00" : "var(--ink-mute)", fontWeight: aligns[i] === a ? 600 : 400 }}>
                      {a[0].toUpperCase()}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Max cell length */}
          <div className="flex items-center gap-4">
            <label className="text-[13px] font-medium" style={{ color: "var(--ink-soft)" }}>Max cell length</label>
            <input type="range" min={20} max={200} value={maxLen} onChange={(e) => { const v = Number(e.target.value); setMaxLen(v); setMd(toMarkdown(headers, rows, aligns, v)); }} className="flex-1" />
            <span className="text-[13px] w-8 text-center" style={{ color: "var(--ink-mute)" }}>{maxLen}</span>
          </div>

          {/* Output */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>Markdown output · {rows.length} rows</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="overflow-auto max-h-[400px] p-4 text-[12px] leading-relaxed" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>
              {md}
            </pre>
          </div>

          <SoftCTA text="Publishing this table? Sohovi ensures the data behind it stays accurate on every refresh →" />
          <button onClick={() => { setMd(null); setHeaders([]); setRows([]); setPastedCSV(""); }} className="text-[13px] underline underline-offset-2" style={{ color: "var(--ink-mute)" }}>Convert another file</button>

          <HardCTA
            headline={`${rows.length} rows in your table — is the data behind it trustworthy?`}
            body="A Markdown table is only as good as its source data. Sohovi profiles your CSV, scores quality across 10 dimensions, and alerts you when something degrades — before it ends up in a doc or report."
            bullets={[
              "Instant data profiling — null rates, type consistency, value distributions",
              "Quality scoring across completeness, validity, uniqueness, and more",
              "Track quality over time with a full run history",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="CSV to Markdown Table" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to convert CSV to a Markdown table</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload a CSV or paste CSV text", body: "Switch between file upload and paste mode. The tool accepts standard CSV with commas, quoted fields, and any number of columns." },
            { step: "2", title: "Adjust alignment and cell length", body: "Set alignment (left, center, right) per column using the toggles. Use the cell length slider to truncate long values so your table stays readable." },
            { step: "3", title: "Copy to clipboard", body: "Click Copy to get the full Markdown table. Paste it directly into GitHub READMEs, GitLab wikis, Notion, Obsidian, or any Markdown editor." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/csv-to-markdown" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
