"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Copy, Download, Check, Loader2, AlertCircle } from "lucide-react";

type Dialect = "mysql" | "postgresql" | "sqlite" | "mssql";

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

function inferSQLType(values: string[], dialect: Dialect): string {
  const nonEmpty = values.filter((v) => v !== "");
  if (!nonEmpty.length) return dialect === "postgresql" ? "TEXT" : "VARCHAR(255)";
  const isInt = nonEmpty.every((v) => /^-?\d+$/.test(v));
  if (isInt) return "INTEGER";
  const isFloat = nonEmpty.every((v) => /^-?\d+(\.\d+)?$/.test(v));
  if (isFloat) return dialect === "postgresql" ? "NUMERIC" : "DECIMAL(18,6)";
  const maxLen = Math.max(...nonEmpty.map((v) => v.length));
  if (dialect === "postgresql") return "TEXT";
  if (dialect === "mssql") return maxLen > 4000 ? "NVARCHAR(MAX)" : `NVARCHAR(${Math.max(maxLen * 2, 50)})`;
  return `VARCHAR(${Math.max(maxLen * 2, 50)})`;
}

function quoteIdent(name: string, dialect: Dialect): string {
  if (dialect === "mssql") return `[${name}]`;
  if (dialect === "postgresql") return `"${name}"`;
  return `\`${name}\``;
}

function escapeValue(v: string, dialect: Dialect): string {
  if (v === "" || v.toLowerCase() === "null") return "NULL";
  const escaped = v.replace(/'/g, "''");
  return `'${escaped}'`;
}

function generateSQL(
  headers: string[],
  rows: string[][],
  tableName: string,
  dialect: Dialect,
  batchSize: number,
  includeCreate: boolean
): string {
  const parts: string[] = [];
  const qi = (n: string) => quoteIdent(n, dialect);
  const qt = qi(tableName);

  if (includeCreate) {
    const colTypes = headers.map((h, i) => `  ${qi(h)} ${inferSQLType(rows.map((r) => r[i] ?? ""), dialect)}`);
    if (dialect === "mysql") {
      parts.push(`CREATE TABLE IF NOT EXISTS ${qt} (\n${colTypes.join(",\n")}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n`);
    } else if (dialect === "mssql") {
      parts.push(`IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')\nCREATE TABLE ${qt} (\n${colTypes.join(",\n")}\n);\n`);
    } else {
      parts.push(`CREATE TABLE IF NOT EXISTS ${qt} (\n${colTypes.join(",\n")}\n);\n`);
    }
  }

  const colList = headers.map(qi).join(", ");
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const valuesList = batch.map((row) => `(${headers.map((_, j) => escapeValue(row[j] ?? "", dialect)).join(", ")})`).join(",\n  ");
    parts.push(`INSERT INTO ${qt} (${colList})\nVALUES\n  ${valuesList};\n`);
  }

  return parts.join("\n");
}

const faqs: FAQItem[] = [
  { q: "How do I convert a CSV to SQL INSERT statements?", a: "Upload your CSV, set the table name and dialect, then click Generate SQL. The tool reads the headers as column names and generates one INSERT statement per batch of rows (default 100 rows per INSERT for performance)." },
  { q: "Which SQL dialects are supported?", a: "MySQL, PostgreSQL, SQLite, and Microsoft SQL Server (MSSQL). The differences include identifier quoting (backticks vs double-quotes vs square brackets), data type names, and CREATE TABLE syntax." },
  { q: "Does it include a CREATE TABLE statement?", a: "Yes — enable the 'Include CREATE TABLE' toggle and the tool will infer column types (INTEGER, DECIMAL, VARCHAR/TEXT) from your data and generate the full table definition." },
  { q: "How are NULL values handled?", a: "Empty cells and cells containing the text 'null' (case-insensitive) are converted to SQL NULL. All other values are escaped as string literals with single quotes doubled." },
  { q: "Is there a row limit?", a: "No. The tool processes your entire file in the browser. For very large outputs, the preview is truncated at 10,000 characters but the download always contains the full SQL." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Backend Engineer",
    domain: "Software Engineering",
    icon: "🖥️",
    scenario: "A client delivers the initial product catalog as a CSV before the data importer is built. The PostgreSQL staging database needs seeding immediately so the rest of the team can begin testing.",
    outcome: "Generates CREATE TABLE + batched INSERT statements in 20 seconds. Pastes into psql. Database is seeded and the team unblocked.",
  },
  {
    persona: "Database Administrator",
    domain: "Enterprise IT",
    icon: "🛡️",
    scenario: "Finance team exports a reference table of cost centres and GL codes from Excel. It needs to land in a MySQL production database before month-end close — no Python environment is available.",
    outcome: "Selects MySQL dialect, sets batch size 500, downloads the .sql file. Runs via MySQL Workbench. Done in one lunch break.",
  },
  {
    persona: "Data Analyst",
    domain: "Analytics",
    icon: "📉",
    scenario: "Wants to query a 5,000-row CSV in SQL locally using SQLite. Knows SQL well but has no interest in writing 5,000 INSERT statements by hand.",
    outcome: "Selects SQLite dialect, downloads the SQL file, runs it in DB Browser for SQLite. Starts writing queries immediately.",
  },
  {
    persona: "QA Engineer",
    domain: "Software Testing",
    icon: "🧪",
    scenario: "Test fixtures are maintained in a shared CSV spreadsheet. Every sprint the team needs to reload a clean test database. Writing SQL by hand is slow and introduces typos.",
    outcome: "CSV fixture → generate SQL → run against test DB. Fully repeatable process. Every sprint setup takes under 5 minutes.",
  },
];

const relatedTools = [
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert CSV to a JSON array" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select and reorder CSV columns before importing" },
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Clean duplicates before inserting into a database" },
];

export function CsvToSqlClient() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [tableName, setTableName] = useState("my_table");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [batchSize, setBatchSize] = useState(100);
  const [includeCreate, setIncludeCreate] = useState(true);
  const [sql, setSql] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("output");

  async function handleFile(file: File) {
    setLoading(true); setError(null); setSql(null);
    try {
      const text = await file.text();
      const { headers: h, rows: r } = parseCSVText(text);
      setHeaders(h); setRows(r);
      setTableName(file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "my_table");
      setFileName(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to parse"); }
    finally { setLoading(false); }
  }

  function handleGenerate() {
    try {
      const output = generateSQL(headers, rows, tableName, dialect, batchSize, includeCreate);
      setSql(output);
    } catch (e) { setError(e instanceof Error ? e.message : "Generation failed"); }
  }

  function handleCopy() {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!sql) return;
    const blob = new Blob([sql], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${fileName}.sql`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(181,212,230,0.12)", color: "#2C6E8A", border: "1px solid rgba(181,212,230,0.4)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free CSV to SQL Generator
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Convert any CSV to SQL INSERT statements in seconds. MySQL, PostgreSQL, SQLite, MSSQL — with optional CREATE TABLE.
          <strong style={{ color: "var(--ink)" }}> Your data stays in your browser.</strong>
        </p>
      </header>

      {!headers.length && !loading && <UploadZone onFile={handleFile} />}
      {loading && <div className="flex items-center justify-center gap-3 py-16"><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} /><span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Reading file…</span></div>}
      {error && <div className="flex items-center gap-3 p-4 rounded-xl mt-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-[14px] text-red-700">{error}</p></div>}

      {headers.length > 0 && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
              {rows.length.toLocaleString()} rows · {headers.length} columns
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Table name</label>
                <input value={tableName} onChange={(e) => setTableName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-[13px] font-mono focus:outline-none" style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>SQL dialect</label>
                <select value={dialect} onChange={(e) => setDialect(e.target.value as Dialect)} className="w-full rounded-lg border px-3 py-2 text-[13px] focus:outline-none" style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)" }}>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mssql">MSSQL (SQL Server)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeCreate} onChange={(e) => setIncludeCreate(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-[13px]" style={{ color: "var(--ink-soft)" }}>Include CREATE TABLE</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-[13px]" style={{ color: "var(--ink-soft)" }}>Rows per INSERT</label>
                <select value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="rounded-lg border px-3 py-1.5 text-[13px]" style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)" }}>
                  {[1, 10, 50, 100, 500, 1000].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleGenerate} className="w-full py-3 rounded-xl font-semibold text-[14px] transition-all" style={{ background: "var(--ink)", color: "white" }}>
              Generate SQL
            </button>
          </div>

          {sql && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
                  {rows.length.toLocaleString()} rows · {(sql.length / 1024).toFixed(1)} KB SQL
                </span>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium" style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy SQL"}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "var(--ink)", color: "white" }}>
                    <Download className="w-4 h-4" />
                    Download .sql
                  </button>
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
                <div className="px-4 py-2.5" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
                  <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>SQL output (preview)</span>
                </div>
                <pre className="overflow-auto max-h-[400px] p-4 text-[12px] leading-relaxed" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>
                  {sql.length > 10000 ? sql.slice(0, 10000) + "\n\n-- ... truncated. Download for full output." : sql}
                </pre>
              </div>

              <SoftCTA text="Before you run the INSERT — profile this data for nulls, type issues, and duplicates with Sohovi →" />

              <button
                onClick={() => { setHeaders([]); setRows([]); setSql(null); setError(null); }}
                className="text-[13px] underline underline-offset-2"
                style={{ color: "var(--ink-mute)" }}
              >
                Convert another file
              </button>

              <HardCTA
                headline={`${rows.length.toLocaleString()} rows ready to import — check quality before it hits your database`}
                body="Bad data imported is bad data stored. Sohovi profiles your source CSV for null rates, type consistency, duplicates, and format issues — before you run the INSERT."
                bullets={[
                  "Null rate and completeness profiling per column",
                  "Type consistency checks — catch text-in-number-column issues before import",
                  "Duplicate detection before data lands in your database",
                ]}
              />
            </>
          )}
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="CSV to SQL Generator" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to generate SQL INSERT statements from a CSV</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Upload your CSV file", body: "Drop your file into the upload zone. The tool reads your headers as column names and your rows as values. No data is sent to any server." },
            { step: "2", title: "Configure table name, dialect, and options", body: "Set your target table name (defaults to the filename). Choose your SQL dialect — MySQL, PostgreSQL, SQLite, or MSSQL. Enable CREATE TABLE to get a full schema statement with inferred column types." },
            { step: "3", title: "Generate, copy, or download", body: "Click Generate SQL to produce the statements. Copy to clipboard or download as a .sql file. The preview is truncated for large outputs, but the download is always complete." },
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

      <ToolFAQ items={faqs} toolUrl="/tools/csv-to-sql" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
