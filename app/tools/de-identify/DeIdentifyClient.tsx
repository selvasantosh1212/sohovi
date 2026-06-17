"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { HardCTA } from "@/components/tools/HardCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import {
  Download, AlertCircle, Loader2, ShieldOff, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { parseFile, rowsToCSV, downloadCSV } from "@/lib/tools/csv-parse";
import {
  classifyColumn, suggestAction, applyDeIdentification, ACTION_LABELS, COLUMN_CLASS_LABELS,
  type ColumnConfig, type ColumnClass, type DeIdAction,
} from "@/lib/tools/anonymize";
import { computeKAnonymity } from "@/lib/tools/k-anonymity";

const CLASS_COLORS: Record<ColumnClass, { bg: string; text: string; border: string }> = {
  direct:    { bg: "rgba(239,68,68,0.08)",   text: "#DC2626", border: "rgba(239,68,68,0.25)" },
  quasi:     { bg: "rgba(245,158,11,0.08)",  text: "#B45309", border: "rgba(245,158,11,0.25)" },
  sensitive: { bg: "rgba(139,92,246,0.08)",  text: "#7C3AED", border: "rgba(139,92,246,0.25)" },
  safe:      { bg: "rgba(0,201,167,0.06)",   text: "#00A88E", border: "rgba(0,201,167,0.2)" },
};

const ACTIONS_BY_CLASS: Record<ColumnClass, DeIdAction[]> = {
  direct:    ["suppress", "mask", "pseudonymize", "keep"],
  quasi:     ["generalize_date", "generalize_zip", "generalize_numeric", "top_bottom_code", "mask", "suppress", "keep"],
  sensitive: ["mask", "suppress", "keep"],
  safe:      ["keep", "mask", "suppress"],
};

const CLASS_OPTIONS: ColumnClass[] = ["direct", "quasi", "sensitive", "safe"];

const faqs: FAQItem[] = [
  {
    q: "Is my data uploaded to a server?",
    a: "No. Everything runs entirely in your browser. Your raw data never leaves your device — this is a hard requirement for human-subjects and PHI data. Open DevTools → Network to verify.",
  },
  {
    q: "What is k-anonymity?",
    a: "A dataset is k-anonymous if every row is indistinguishable from at least k-1 other rows based on quasi-identifier values. k=5 means no individual can be singled out from age + ZIP code + gender alone — each matching combination has at least 5 people.",
  },
  {
    q: "What is the difference between a direct identifier and a quasi-identifier?",
    a: "Direct identifiers (name, email, SSN) identify a person on their own. Quasi-identifiers (age, ZIP, gender) can identify someone when combined. k-anonymity addresses quasi-identifier combinations.",
  },
  {
    q: "What does 'pseudonymize' mean here?",
    a: "Each unique value is replaced with a stable fake ID (ID-000001…) for the duration of the session. The same original value always gets the same ID within the file, so you can still link rows.",
  },
  {
    q: "What is the methods log?",
    a: "A plain-text document listing every column, its classification, and the transform applied. Suitable for an IRB application data-management section or a published dataset appendix.",
  },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Academic Researcher",
    domain: "Social Science",
    icon: "🎓",
    scenario: "Preparing a survey dataset for upload to an open-access repository. IRB approval requires the data to be de-identified before sharing, and the journal requires a methods log.",
    outcome: "Suppresses name and email, generalizes DOB to decade age band and ZIP to 3-digit prefix, hits k=7, exports the de-identified file + methods log for the IRB appendix.",
  },
  {
    persona: "Clinical Research Coordinator",
    domain: "Healthcare",
    icon: "🏥",
    scenario: "Sharing a patient cohort extract with a collaborating institution. Cannot upload the file to any third-party SaaS because it contains PHI.",
    outcome: "Runs the entire de-identification in the browser with no upload. Pseudonymizes patient IDs, masks diagnosis codes, checks k-anonymity on age + ZIP. Exports for transfer.",
  },
  {
    persona: "Graduate Student",
    domain: "Public Health",
    icon: "📊",
    scenario: "Thesis dataset contains participant names, exact DOBs, and home ZIP codes. Committee requires the shared version meet k≥5 before committee members can review the raw results.",
    outcome: "Age bands + 3-digit ZIP raise k from 1 to 6. Exports the de-identified version for committee review and the methods log for the appendix.",
  },
  {
    persona: "Data Librarian",
    domain: "University Library",
    icon: "📚",
    scenario: "Assisting a faculty member in preparing a dataset for the institutional repository. Needs to verify de-identification before accession.",
    outcome: "Runs the tool, reviews the column classification, confirms k≥3 with the faculty member, and deposits the de-identified version with the auto-generated methods log.",
  },
];

const relatedTools = [
  { name: "PII Audit", href: "/tools/pii-audit", description: "Check any file for personal data before sharing" },
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove duplicate rows from any CSV" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Drop columns before sharing a file" },
];

type Step = "upload" | "configure" | "kanon" | "done";

export function DeIdentifyClient() {
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [configs, setConfigs] = useState<ColumnConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // k-anon state
  const [targetK, setTargetK] = useState(5);
  const [kanonResult, setKanonResult] = useState<ReturnType<typeof computeKAnonymity> | null>(null);
  const [showKanon, setShowKanon] = useState(false);

  // result state
  const [deIdResult, setDeIdResult] = useState<ReturnType<typeof applyDeIdentification> | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      const initialConfigs: ColumnConfig[] = parsed.headers.map((h, i) => {
        const cls = classifyColumn(h);
        return { header: h, colIndex: i, classification: cls, action: suggestAction(h, cls) };
      });
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setFileName(file.name.replace(/\.[^.]+$/, ""));
      setConfigs(initialConfigs);
      setStep("configure");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read file");
    } finally {
      setLoading(false);
    }
  }

  function updateConfig(colIndex: number, field: "classification" | "action", value: string) {
    setConfigs((prev) =>
      prev.map((c) => {
        if (c.colIndex !== colIndex) return c;
        if (field === "classification") {
          const cls = value as ColumnClass;
          return { ...c, classification: cls, action: suggestAction(c.header, cls) };
        }
        return { ...c, action: value as DeIdAction };
      })
    );
  }

  function runKAnon() {
    const quasiCols = configs.filter((c) => c.classification === "quasi").map((c) => c.header);
    if (!quasiCols.length) {
      setError("Mark at least one column as a quasi-identifier to check k-anonymity.");
      return;
    }
    const result = computeKAnonymity(headers, rows, quasiCols, targetK);
    setKanonResult(result);
    setShowKanon(true);
  }

  function runDeIdentification() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const result = applyDeIdentification(headers, rows, configs);
        setDeIdResult(result);
        setStep("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "De-identification failed");
      } finally {
        setLoading(false);
      }
    }, 10);
  }

  function handleDownloadFile() {
    if (!deIdResult) return;
    downloadCSV(rowsToCSV(deIdResult.headers, deIdResult.rows), `${fileName}-deidentified.csv`);
  }

  function handleDownloadLog() {
    if (!deIdResult) return;
    const blob = new Blob([deIdResult.methodsLog], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}-methods-log.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadCrosswalk() {
    if (!deIdResult) return;
    const esc = (v: string) =>
      v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
    const lines = ["column,original_value,pseudonym_id"];
    for (const [col, map] of deIdResult.pseudoMaps) {
      for (const [original, pseudoId] of map) {
        lines.push(`${esc(col)},${esc(original)},${esc(pseudoId)}`);
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}-crosswalk.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const suppressedCount = configs.filter((c) => c.action === "suppress").length;
  const flaggedCount = configs.filter((c) => c.classification !== "safe").length;

  return (
    <article className="mx-auto max-w-[820px] px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <div
          className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(139,92,246,0.08)", color: "#7C3AED", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Research Data De-Identifier
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Detect direct and quasi-identifiers, apply masking, generalization, and pseudonymization,
          check k-anonymity, and export a de-identified dataset with a methods log.{" "}
          <strong style={{ color: "var(--ink)" }}>Your raw data never leaves your browser.</strong>
        </p>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === "upload" && !loading && <UploadZone onFile={handleFile} />}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-mute)" }} />
          <span className="text-[14px]" style={{ color: "var(--ink-mute)" }}>Processing…</span>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === "configure" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
            <ShieldOff className="w-6 h-6 shrink-0" style={{ color: "#7C3AED" }} />
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                {fileName} — {rows.length.toLocaleString()} rows · {headers.length} columns
              </p>
              <p className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
                {flaggedCount} column{flaggedCount !== 1 ? "s" : ""} flagged as identifiers or sensitive.
                Review and adjust below, then run de-identification.
              </p>
            </div>
          </div>

          {/* Column config table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-5 py-3 grid grid-cols-[1fr_140px_180px] gap-3 text-[11px] font-semibold uppercase tracking-widest" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)", color: "var(--ink-mute)" }}>
              <span>Column</span>
              <span>Classification</span>
              <span>Action</span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--hair)" }}>
              {configs.map((cfg) => {
                const colors = CLASS_COLORS[cfg.classification];
                return (
                  <div key={cfg.colIndex} className="px-5 py-3 grid grid-cols-[1fr_140px_180px] gap-3 items-center">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: colors.text }}
                      />
                      <span className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{cfg.header}</span>
                    </div>

                    <select
                      value={cfg.classification}
                      onChange={(e) => updateConfig(cfg.colIndex, "classification", e.target.value)}
                      className="text-[12px] px-2 py-1.5 rounded-lg border appearance-none"
                      style={{
                        borderColor: colors.border,
                        background: colors.bg,
                        color: colors.text,
                        fontWeight: 600,
                      }}
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls}>{COLUMN_CLASS_LABELS[cls]}</option>
                      ))}
                    </select>

                    <select
                      value={cfg.action}
                      onChange={(e) => updateConfig(cfg.colIndex, "action", e.target.value)}
                      className="text-[12px] px-2 py-1.5 rounded-lg border"
                      style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)" }}
                    >
                      {ACTIONS_BY_CLASS[cfg.classification].map((a) => (
                        <option key={a} value={a}>{ACTION_LABELS[a]}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* k-anonymity panel */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <button
              onClick={() => setShowKanon((v) => !v)}
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              style={{ background: "var(--paper)" }}
            >
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>k-Anonymity Check <span className="text-[12px] font-normal" style={{ color: "var(--ink-mute)" }}>(optional)</span></p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>
                  Verify your quasi-identifier columns achieve the target k before exporting.
                </p>
              </div>
              {showKanon ? <ChevronUp className="w-4 h-4" style={{ color: "var(--ink-mute)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--ink-mute)" }} />}
            </button>

            {showKanon && (
              <div className="px-5 pb-5 pt-2 border-t space-y-4" style={{ borderColor: "var(--hair)" }}>
                <div className="flex items-center gap-3">
                  <label className="text-[13px] font-medium shrink-0" style={{ color: "var(--ink)" }}>Target k:</label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={targetK}
                    onChange={(e) => setTargetK(Math.max(2, parseInt(e.target.value) || 2))}
                    className="w-20 text-[13px] px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)" }}
                  />
                  <span className="text-[12px]" style={{ color: "var(--ink-mute)" }}>
                    (k=5 is common for research data sharing; HIPAA Safe Harbor uses k=no-single-person)
                  </span>
                </div>

                <div>
                  <p className="text-[12px] mb-2" style={{ color: "var(--ink-mute)" }}>
                    Quasi-identifier columns in scope:{" "}
                    <strong style={{ color: "var(--ink)" }}>
                      {configs.filter((c) => c.classification === "quasi").map((c) => c.header).join(", ") || "none — mark columns as quasi-identifier above"}
                    </strong>
                  </p>
                  <button
                    onClick={runKAnon}
                    className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
                    style={{ background: "#7C3AED", color: "white" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7C3AED"; }}
                  >
                    Check k-anonymity
                  </button>
                </div>

                {kanonResult && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Current k", value: kanonResult.k, color: kanonResult.k >= targetK ? "#00A88E" : "#DC2626" },
                        { label: "Equivalence classes", value: kanonResult.equivalenceClasses, color: "var(--ink)" },
                        { label: "At-risk rows", value: kanonResult.violatingRowCount, color: kanonResult.violatingRowCount === 0 ? "#00A88E" : "#DC2626" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}>
                          <div className="text-[22px] font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-mute)" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {kanonResult.k >= targetK ? (
                      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.2)" }}>
                        <span className="text-[13px] font-semibold" style={{ color: "#00A88E" }}>
                          ✓ k={kanonResult.k} — dataset meets the target of k={targetK}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <span className="text-[13px] font-semibold" style={{ color: "#DC2626" }}>
                            k={kanonResult.k} is below target k={targetK} — {kanonResult.violatingRowCount} rows are at risk
                          </span>
                        </div>
                        {kanonResult.suggestions.length > 0 && (
                          <div className="p-4 rounded-lg text-[13px] space-y-1" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                            {kanonResult.suggestions.map((s, i) => (
                              <p key={i} style={{ color: "var(--ink-soft)" }}>{s}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={runDeIdentification}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-50"
              style={{ background: "#7C3AED", color: "white" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7C3AED"; }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <>
                <ShieldOff className="w-4 h-4" />
                Run de-identification
              </>}
            </button>
            <p className="text-[12px]" style={{ color: "var(--ink-mute)" }}>
              {suppressedCount > 0 && `${suppressedCount} column${suppressedCount !== 1 ? "s" : ""} will be suppressed. `}
              Nothing is uploaded.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === "done" && deIdResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border" style={{ background: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.2)" }}>
            <ShieldOff className="w-7 h-7 shrink-0" style={{ color: "#7C3AED" }} />
            <div>
              <p className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>De-identification complete</p>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-mute)" }}>
                {deIdResult.rows.length.toLocaleString()} rows · {deIdResult.headers.length} columns
                {suppressedCount > 0 && ` (${suppressedCount} suppressed)`} · methods log included
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-5 py-3" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Preview — first 5 rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--hair)" }}>
                    {deIdResult.headers.map((h) => (
                      <th key={h} className="text-left px-4 py-2 font-semibold whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deIdResult.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--hair)" }}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap max-w-[160px] truncate" style={{ color: "var(--ink)" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all"
              style={{ background: "#7C3AED", color: "white" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7C3AED"; }}
            >
              <Download className="w-4 h-4" />
              Download de-identified file (.csv)
            </button>
            <button
              onClick={handleDownloadLog}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] border transition-all"
              style={{ borderColor: "rgba(139,92,246,0.4)", color: "#7C3AED" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <Download className="w-4 h-4" />
              Download methods log (.txt)
            </button>
            {deIdResult.pseudoMaps.size > 0 && (
              <button
                onClick={handleDownloadCrosswalk}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] border transition-all"
                style={{ borderColor: "rgba(139,92,246,0.4)", color: "#7C3AED" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <Download className="w-4 h-4" />
                Download crosswalk (.csv)
              </button>
            )}
            <button
              onClick={() => { setStep("upload"); setDeIdResult(null); setKanonResult(null); setShowKanon(false); }}
              className="px-5 py-3 rounded-xl text-[14px] border transition-all"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink-soft)" }}
            >
              Start over
            </button>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg text-[12px]" style={{ background: "var(--cream)", border: "1px solid var(--hair)" }}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--ink-mute)" }} />
            <p style={{ color: "var(--ink-mute)" }}>
              Pseudonym crosswalk (original → fake ID) is held in memory only and will be lost when you close or refresh this tab.
              {deIdResult.pseudoMaps.size > 0 && " Download the crosswalk now if you need to re-link records later."}
            </p>
          </div>

          <HardCTA
            headline="Ongoing de-identification and PII monitoring for your team"
            body="Sohovi automatically detects PII across every connected dataset, monitors for new personal data as your data changes, and keeps an audit trail — without downloading files each time."
            bullets={[
              "Automatic PII detection across all connected datasets and uploads",
              "Column-level alerts when personal data appears in unexpected places",
              "Full audit trail for compliance documentation",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="Research Data De-Identifier" />

      {/* How it works */}
      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>
          How to de-identify a research dataset
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Upload your CSV or Excel file",
              body: "Drag and drop your dataset. The tool auto-classifies each column as a direct identifier, quasi-identifier, sensitive attribute, or safe — based on column names and patterns.",
            },
            {
              step: "2",
              title: "Review and configure transforms",
              body: "Override any auto-classification. Choose a per-column action: suppress the column entirely, mask values, pseudonymize (stable fake IDs), generalize dates to age bands, generalize ZIP codes to 3-digit prefixes, or top/bottom-code outliers.",
            },
            {
              step: "3",
              title: "Check k-anonymity (optional)",
              body: "Select your quasi-identifier columns and a target k. k=5 means no individual can be singled out from the combination of quasi-identifier values alone. The tool shows the current k and specific generalization suggestions if you fall short.",
            },
            {
              step: "4",
              title: "Export the de-identified file and methods log",
              body: "Download the transformed dataset as CSV, plus a plain-text methods log describing every transform applied — suitable for an IRB application or published dataset appendix.",
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
          Why in-browser de-identification matters for human-subjects data
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Most de-identification tools upload your file to a server. For any dataset containing
          human-subjects data, health information, or data covered by GDPR or HIPAA, that upload
          is itself a data transfer — and often one that requires a data processing agreement with
          the vendor. Researchers frequently cannot share data with a SaaS tool at all before
          de-identification.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          This tool runs entirely in your browser. Your raw data never leaves your device. There
          is no server, no account, no third-party data processor. The de-identification happens
          locally, and only the already-de-identified output is saved anywhere.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          The k-anonymity check implements the model described by Samarati and Sweeney (1998): a
          dataset is k-anonymous when every combination of quasi-identifier values appears in at
          least k rows. k=5 is a common threshold for research data repositories; HIPAA Safe Harbor
          de-identification requires specific field removal rather than a k threshold, but k-anonymity
          is a useful complement for verifying quasi-identifier combinations.
        </p>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/de-identify" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
