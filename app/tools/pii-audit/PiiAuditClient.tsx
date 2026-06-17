"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Download, AlertCircle, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { parseFile, rowsToCSV, downloadCSV } from "@/lib/tools/csv-parse";
import { detectPiiInColumns, type ColumnPiiResult } from "@/lib/tools/pii-detect";

const PII_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pii: { bg: "rgba(224,113,80,0.08)", text: "#C45A3C", border: "rgba(224,113,80,0.25)" },
  secret: { bg: "rgba(239,68,68,0.08)", text: "#DC2626", border: "rgba(239,68,68,0.25)" },
  clean: { bg: "rgba(0,201,167,0.06)", text: "#00A88E", border: "rgba(0,201,167,0.2)" },
};

const TYPE_BADGE_COLOR: Record<string, string> = {
  email: "#6366F1",
  phone: "#F59E0B",
  ssn: "#EF4444",
  credit_card: "#EF4444",
  address: "#8B5CF6",
  api_key: "#DC2626",
  aws_key: "#DC2626",
  jwt: "#DC2626",
  high_entropy_secret: "#DC2626",
};

const faqs: FAQItem[] = [
  {
    q: "Is my file uploaded to a server?",
    a: "No. The entire scan runs in your browser using JavaScript. Your file never leaves your device. Open DevTools → Network tab to verify: you'll see zero file-data requests.",
  },
  {
    q: "What types of PII does this detect?",
    a: "Emails, phone numbers, US Social Security Numbers (SSNs), credit card numbers, street addresses, API keys, AWS access keys, JSON Web Tokens (JWTs), and high-entropy secret tokens.",
  },
  {
    q: "What does 'redacted copy' mean?",
    a: "Every cell in a flagged column is replaced with bullet characters (••••••••). Column names, unflagged columns, and row count stay exactly the same.",
  },
  {
    q: "Does it scan every row, or just a sample?",
    a: "Every cell in every row is scanned. The counts shown are full-file counts, not estimates.",
  },
  {
    q: "What file types are supported?",
    a: "CSV (.csv) and Excel (.xlsx, .xls). Everything runs in the browser with no upload.",
  },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Freelance Consultant",
    domain: "Consulting / Agency",
    icon: "💼",
    scenario: "Preparing to email a client deliverable — a 5,000-row dataset pulled from the CRM. Needs to confirm no employee SSNs or emails crept in from a joined table.",
    outcome: "Spots 2 columns with email addresses and 1 with SSNs. Downloads redacted copy, sends that instead. Avoids a GDPR breach.",
  },
  {
    persona: "HR Manager",
    domain: "Human Resources",
    icon: "👥",
    scenario: "Sending a vendor a headcount file for benefits enrollment. Accidentally included salary and national ID columns that weren't in scope.",
    outcome: "PII Audit flags both columns before the email sends. Removes them from the file. No sensitive data shared with the vendor.",
  },
  {
    persona: "Developer",
    domain: "Engineering",
    icon: "💻",
    scenario: "About to commit a test fixture CSV to a public GitHub repo. Worried a real API key or database password got into the test data.",
    outcome: "Tool detects 3 high-entropy secrets in a 'notes' column. Developer replaces them with placeholder values before pushing.",
  },
  {
    persona: "Paralegal",
    domain: "Legal",
    icon: "⚖️",
    scenario: "Preparing a document production for opposing counsel. The production CSV contains client records — needs to confirm privileged fields are excluded.",
    outcome: "Flags phone numbers and address columns that were inadvertently included. Corrects the export before production.",
  },
];

const relatedTools = [
  { name: "Research Data De-Identifier", href: "/tools/de-identify", description: "Mask, generalize, and check k-anonymity for research datasets" },
  { name: "Two-File Reconciler", href: "/tools/compare", description: "Compare two CSV files and see what changed" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Drop sensitive columns before sharing a file" },
];

export function PiiAuditClient() {
  const [results, setResults] = useState<ColumnPiiResult[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const parsed = await parseFile(file);
      const detected = detectPiiInColumns(parsed.headers, parsed.rows);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setFileName(file.name.replace(/\.[^.]+$/, ""));
      setResults(detected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process file");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadRedacted() {
    if (!results) return;
    const flaggedCols = new Set(results.filter((r) => r.flags.length > 0).map((r) => r.column));
    const redactedRows = rows.map((row) =>
      headers.map((h, i) => (flaggedCols.has(h) ? "••••••••" : row[i] ?? ""))
    );
    downloadCSV(rowsToCSV(headers, redactedRows), `${fileName}-redacted.csv`);
  }

  const piiColCount = results?.filter((r) => r.hasPii).length ?? 0;
  const secretColCount = results?.filter((r) => r.hasSecrets).length ?? 0;
  const cleanColCount = results ? results.length - piiColCount - secretColCount : 0;
  const totalFlags = results?.reduce((acc, r) => acc + r.flags.length, 0) ?? 0;

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
          Pre-Send PII Audit
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Check any CSV or Excel file for personal data before you send it. See every email, phone,
          SSN, address, and API key it contains.{" "}
          <strong style={{ color: "var(--ink)" }}>Your file never leaves your browser.</strong>
        </p>
      </header>

      {/* Upload */}
      {!results && !loading && <UploadZone onFile={handleFile} />}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} />
          <span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Scanning for PII…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Risk summary banner */}
          {totalFlags === 0 ? (
            rows.length === 0 ? (
              <div className="flex items-center gap-4 p-5 rounded-2xl border" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.3)" }}>
                <AlertCircle className="w-7 h-7 shrink-0" style={{ color: "#B45309" }} />
                <div>
                  <p className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>No data rows to scan</p>
                  <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    This file only contains a header row — there are no data rows for the scanner to check. Upload a file with at least one data row.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-5 rounded-2xl border" style={{ background: PII_COLORS.clean.bg, borderColor: PII_COLORS.clean.border }}>
                <ShieldCheck className="w-7 h-7 shrink-0" style={{ color: PII_COLORS.clean.text }} />
                <div>
                  <p className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>No PII or secrets detected</p>
                  <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    All {results.length} columns scanned — no personal data or secrets found.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-start gap-4 p-5 rounded-2xl border" style={{ background: PII_COLORS.pii.bg, borderColor: PII_COLORS.pii.border }}>
              <ShieldAlert className="w-7 h-7 shrink-0 mt-0.5" style={{ color: PII_COLORS.pii.text }} />
              <div className="flex-1">
                <p className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
                  PII or secrets found in {piiColCount + secretColCount} column{piiColCount + secretColCount !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-[13px]">
                  {piiColCount > 0 && (
                    <span style={{ color: PII_COLORS.pii.text }}>
                      <strong>{piiColCount}</strong> PII column{piiColCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {secretColCount > 0 && (
                    <span style={{ color: PII_COLORS.secret.text }}>
                      <strong>{secretColCount}</strong> secret{secretColCount !== 1 ? "s" : ""} / API key{secretColCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {cleanColCount > 0 && (
                    <span style={{ color: "var(--ink-mute)" }}>
                      <strong>{cleanColCount}</strong> clean column{cleanColCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Column table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-5 py-3" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                Column-by-column scan results
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--hair)" }}>
              {results.map((col) => {
                const severity = col.hasSecrets ? "secret" : col.hasPii ? "pii" : "clean";
                const colors = PII_COLORS[severity];
                return (
                  <div key={col.column} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: severity === "clean" ? colors.text : colors.text }}
                        />
                        <span className="text-[14px] font-semibold truncate" style={{ color: "var(--ink)" }}>
                          {col.column}
                        </span>
                      </div>
                      {col.flags.length === 0 ? (
                        <span className="text-[12px] shrink-0 px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                          Clean
                        </span>
                      ) : null}
                    </div>

                    {col.flags.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {col.flags.map((flag) => (
                          <div key={flag.type} className="flex items-start gap-3 flex-wrap">
                            <span
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                background: `${TYPE_BADGE_COLOR[flag.type]}15`,
                                color: TYPE_BADGE_COLOR[flag.type],
                                border: `1px solid ${TYPE_BADGE_COLOR[flag.type]}30`,
                              }}
                            >
                              {flag.label}
                            </span>
                            <span className="text-[12px]" style={{ color: "var(--ink-mute)" }}>
                              {flag.count.toLocaleString()} cell{flag.count !== 1 ? "s" : ""}
                              {flag.samples.length > 0 && (
                                <span className="ml-2">
                                  · <span style={{ color: "var(--ink-soft)" }}>e.g. {flag.samples.slice(0, 2).join(", ")}</span>
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {totalFlags > 0 && (
              <button
                onClick={handleDownloadRedacted}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all"
                style={{ background: "var(--ink)", color: "white" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2D2D48"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; }}
              >
                <Download className="w-4 h-4" />
                Download redacted copy
              </button>
            )}
            <button
              onClick={() => { setResults(null); setRows([]); setHeaders([]); }}
              className="px-5 py-3 rounded-xl text-[14px] border transition-all"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}
            >
              Scan another file
            </button>
          </div>

          <HardCTA
            headline="Monitor PII exposure automatically on every upload"
            body="Sohovi's PII detection dimension flags personal data across every dataset you connect — and alerts you when new PII appears in columns that were previously clean."
            bullets={[
              "Automatic PII detection on every file upload and connector sync",
              "Column-level alerts when PII appears in unexpected places",
              "Full 10-dimension DQ scoring including completeness, validity, and conformity",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="PII Audit" />

      {/* How it works */}
      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>
          How to check a file for personal data before sending it
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Upload your CSV or Excel file",
              body: "Drag and drop your file or click to browse. The scan runs entirely in your browser — nothing is sent to any server. Open DevTools → Network tab to verify.",
            },
            {
              step: "2",
              title: "Review the risk summary",
              body: "See a column-by-column breakdown of every PII type found: emails, phone numbers, SSNs, addresses, API keys, and more. Each flagged column shows the type, count, and masked samples.",
            },
            {
              step: "3",
              title: "Download a redacted copy",
              body: "Click 'Download redacted copy' to get a version with all flagged cells replaced with bullet characters (••••••••) — safe to share, same structure.",
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

      {/* The problem / SEO content */}
      <section className="mt-14 space-y-4">
        <h2 className="text-[22px] font-bold" style={{ color: "var(--ink)" }}>
          Why check a file for PII before you send it?
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Personal data ends up in spreadsheets silently — a CRM export includes email columns you
          didn't ask for, a joined dataset pulls in SSNs from a related table, or test data was built
          from real customer records and never scrubbed. By the time the file is in an email or a
          shared drive, the exposure has already happened.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Under GDPR, CCPA, and HIPAA, sharing a file that contains personal data without a legal
          basis is a breach — even if you didn't intend to include it. The pre-send audit is the
          last line of defence before a file leaves your hands. It costs 30 seconds and catches the
          incidents that would otherwise cost thousands.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          The same logic applies to secrets: a CSV fixture committed to a public repo with a live
          API key in a test column is a security incident, not just a data quality problem. This tool
          catches both — PII and secrets — in a single scan, entirely in your browser.
        </p>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/pii-audit" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
