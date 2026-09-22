"use client";

import { useState, useMemo, useTransition } from "react";
import { Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UploadZone } from "@/components/tools/UploadZone";
import { parseFile, rowsToCSV, downloadCSV, type ParsedFile } from "@/lib/tools/csv-parse";
import {
  classifyColumn,
  suggestAction,
  applyDeIdentification,
  COLUMN_CLASS_LABELS,
  ACTION_LABELS,
  type ColumnClass,
  type DeIdAction,
  type ColumnConfig,
} from "@/lib/tools/anonymize";
import { computeKAnonymity, type KAnonResult } from "@/lib/tools/k-anonymity";
import { savePrivacyAudit, type PrivacyAudit } from "@/app/actions/privacy";

const CLASS_STYLES: Record<ColumnClass, string> = {
  direct: "bg-red-50 text-red-700",
  quasi: "bg-amber-50 text-amber-700",
  sensitive: "bg-violet-50 text-violet-700",
  safe: "bg-slate-100 text-slate-600",
};

const ACTIONS = Object.keys(ACTION_LABELS) as DeIdAction[];

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PrivacyStudioPanel({
  assetId,
  history,
}: {
  assetId: string;
  history: PrivacyAudit[];
}) {
  const [file, setFile] = useState<ParsedFile | null>(null);
  const [configs, setConfigs] = useState<ColumnConfig[]>([]);
  const [targetK, setTargetK] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  async function load(f: File) {
    setError(null);
    setSaved(false);
    try {
      const parsed = await parseFile(f);
      setFile(parsed);
      setConfigs(
        parsed.headers.map((header, colIndex) => {
          const classification = classifyColumn(header);
          return {
            header,
            colIndex,
            classification,
            action: suggestAction(header, classification),
          };
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    }
  }

  const quasiColumns = useMemo(
    () => configs.filter((c) => c.classification === "quasi").map((c) => c.header),
    [configs]
  );

  // k-anonymity is measured on the de-identified output, not the original —
  // generalizing a date or banding an age is exactly what raises k, so
  // measuring the input would understate what the chosen settings achieve.
  const deIdentified = useMemo(
    () => (file && configs.length ? applyDeIdentification(file.headers, file.rows, configs) : null),
    [file, configs]
  );

  const kResult: KAnonResult | null = useMemo(() => {
    if (!deIdentified || quasiColumns.length === 0) return null;
    const surviving = quasiColumns.filter((q) => deIdentified.headers.includes(q));
    if (surviving.length === 0) return null;
    return computeKAnonymity(deIdentified.headers, deIdentified.rows, surviving, targetK);
  }, [deIdentified, quasiColumns, targetK]);

  function setAction(header: string, action: DeIdAction) {
    setConfigs((prev) => prev.map((c) => (c.header === header ? { ...c, action } : c)));
    setSaved(false);
  }

  function setClassification(header: string, classification: ColumnClass) {
    setConfigs((prev) =>
      prev.map((c) => (c.header === header ? { ...c, classification } : c))
    );
    setSaved(false);
  }

  function exportFile() {
    if (!deIdentified || !file) return;
    downloadCSV(
      rowsToCSV(deIdentified.headers, deIdentified.rows),
      file.fileName.replace(/\.(csv|xlsx?|xls)$/i, "") + "-deidentified.csv"
    );
  }

  function save() {
    if (!file) return;
    startTransition(async () => {
      try {
        await savePrivacyAudit({
          asset_id: assetId,
          file_name: file.fileName,
          column_actions: configs.map((c) => ({
            column: c.header,
            class: c.classification,
            action: c.action,
          })),
          quasi_identifiers: quasiColumns,
          target_k: targetK,
          achieved_k: kResult?.k ?? null,
          violating_rows: kResult?.violatingRowCount ?? null,
          row_count: file.rows.length,
        });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save this audit.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
          <UploadZone
            label="Drop the file you need to share safely"
            sublabel="Classified, de-identified and measured entirely in your browser — nothing is uploaded."
            onFile={load}
          />
        </Card>
      ) : (
        <>
          <Card className="p-4 border border-[#EEF0F3] rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-700 truncate">{file.fileName}</p>
              <p className="text-[11px] text-slate-400">
                {file.rows.length.toLocaleString()} rows · {file.headers.length} columns
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setConfigs([]);
                setSaved(false);
              }}
              className="text-[12px] text-slate-500 hover:text-slate-700 shrink-0"
            >
              Replace
            </button>
          </Card>

          {/* k-anonymity readout */}
          {kResult && (
            <Card
              className={`p-5 border rounded-2xl ${
                kResult.k >= targetK ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/40"
              }`}
            >
              <div className="flex items-start gap-3">
                {kResult.k >= targetK ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    k = {kResult.k}
                    {kResult.k >= targetK
                      ? ` — meets your target of ${targetK}.`
                      : ` — below your target of ${targetK}.`}
                  </p>
                  <p className="text-[13px] text-slate-600 mt-1">
                    Every combination of{" "}
                    <span className="font-mono text-[12px]">{quasiColumns.join(", ")}</span>{" "}
                    appears at least {kResult.k} time{kResult.k === 1 ? "" : "s"} across{" "}
                    {kResult.equivalenceClasses.toLocaleString()} distinct groups.
                    {kResult.k === 1 &&
                      " A k of 1 means at least one row is unique on those columns and can be re-identified."}
                  </p>
                  {kResult.violatingRowCount > 0 && (
                    <p className="text-[13px] text-slate-600 mt-1">
                      {kResult.violatingRowCount.toLocaleString()} row
                      {kResult.violatingRowCount === 1 ? "" : "s"} fall below the target.
                    </p>
                  )}
                  {kResult.suggestions.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {kResult.suggestions.map((s, i) => (
                        <li key={i} className="text-[12px] text-slate-500">
                          · {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <label className="text-[12px] text-slate-600">Target k</label>
                    <input
                      type="number"
                      min={2}
                      max={100}
                      value={targetK}
                      onChange={(e) => setTargetK(Math.max(2, Number(e.target.value) || 2))}
                      className="w-16 rounded-lg border border-input bg-white px-2 py-1 text-[13px] outline-none focus-visible:border-ring"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Column classification + action */}
          <Card className="p-5 border border-[#EEF0F3] rounded-2xl space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Columns</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Classification is suggested from the column name — correct it where it is wrong,
                then choose what happens to each column.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
                    <th className="font-medium py-2 pr-4">Column</th>
                    <th className="font-medium py-2 pr-4">Classification</th>
                    <th className="font-medium py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((c) => (
                    <tr key={c.header} className="border-b border-[#F5F6F8] last:border-0">
                      <td className="py-2 pr-4 font-mono text-slate-700 whitespace-nowrap">
                        {c.header}
                      </td>
                      <td className="py-2 pr-4">
                        <select
                          value={c.classification}
                          onChange={(e) =>
                            setClassification(c.header, e.target.value as ColumnClass)
                          }
                          className={`text-[12px] font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${CLASS_STYLES[c.classification]}`}
                        >
                          {(Object.keys(COLUMN_CLASS_LABELS) as ColumnClass[]).map((k) => (
                            <option key={k} value={k}>
                              {COLUMN_CLASS_LABELS[k]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2">
                        <select
                          value={c.action}
                          onChange={(e) => setAction(c.header, e.target.value as DeIdAction)}
                          className="text-[12px] px-2 py-1 rounded-lg border border-[#EEF0F3] bg-white outline-none cursor-pointer focus-visible:border-ring"
                        >
                          {ACTIONS.map((a) => (
                            <option key={a} value={a}>
                              {ACTION_LABELS[a]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={exportFile}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
                style={{ background: "#1A1A2E" }}
              >
                <Download className="w-3.5 h-3.5" />
                Export de-identified file
              </button>
              <button
                onClick={save}
                disabled={saved}
                className="text-[13px] font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#00C9A7", color: "#0d1e33" }}
              >
                {saved ? "Audit saved" : "Save audit"}
              </button>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
            <p className="text-[11px] text-slate-400">
              The file, the de-identified output and the pseudonym mapping stay in your browser.
              Saving records which columns were treated how and the k achieved — never values.
            </p>
          </Card>
        </>
      )}

      {history.length > 0 && (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Previous audits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
                  <th className="font-medium py-2 pr-4">When</th>
                  <th className="font-medium py-2 pr-4">File</th>
                  <th className="font-medium py-2 pr-4 text-right">Target k</th>
                  <th className="font-medium py-2 pr-4 text-right">Achieved k</th>
                  <th className="font-medium py-2 text-right">Rows</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => (
                  <tr key={a.id} className="border-b border-[#F5F6F8] last:border-0">
                    <td className="py-2.5 pr-4 text-slate-500">{formatDate(a.run_at)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 truncate max-w-[220px]">
                      {a.file_name ?? "—"}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-slate-600">{a.target_k ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-right font-medium text-slate-800">
                      {a.achieved_k ?? "—"}
                    </td>
                    <td className="py-2.5 text-right text-slate-500">
                      {a.row_count?.toLocaleString() ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
