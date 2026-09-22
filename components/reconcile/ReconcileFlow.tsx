"use client";

import { useState, useTransition } from "react";
import { Download, Loader2, CheckSquare, Square, GitCompareArrows, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UploadZone } from "@/components/tools/UploadZone";
import { parseFile, rowsToCSV, downloadCSV, type ParsedFile } from "@/lib/tools/csv-parse";
import { keyedDiff, suggestKeyColumns, type DiffResult } from "@/lib/tools/keyed-diff";
import { fuzzyPairKeys, type FuzzyPair } from "@/lib/tools/fuzzy-keys";
import { saveReconciliation, type Reconciliation } from "@/app/actions/reconciliations";

type Tab = "onlyInA" | "onlyInB" | "changed" | "unchanged" | "fuzzy";

const TAB_LABELS: Record<Tab, string> = {
  onlyInA: "Missing from target",
  onlyInB: "New in target",
  changed: "Changed",
  unchanged: "Unchanged",
  fuzzy: "Near matches",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ReconcileFlow({
  assetId,
  history,
  canFuzzy,
}: {
  assetId: string;
  history: Reconciliation[];
  canFuzzy: boolean;
}) {
  const [fileA, setFileA] = useState<ParsedFile | null>(null);
  const [fileB, setFileB] = useState<ParsedFile | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<DiffResult | null>(null);
  const [fuzzy, setFuzzy] = useState<FuzzyPair[]>([]);
  const [threshold, setThreshold] = useState(0.85);
  const [activeTab, setActiveTab] = useState<Tab>("onlyInA");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  async function load(file: File, side: "a" | "b") {
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const parsed = await parseFile(file);
      if (side === "a") {
        setFileA(parsed);
        setSelectedKeys(new Set(suggestKeyColumns(parsed.headers)));
      } else {
        setFileB(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    }
  }

  const sharedHeaders = fileA && fileB
    ? fileA.headers.filter((h) => fileB.headers.includes(h))
    : [];

  function run() {
    if (!fileA || !fileB || selectedKeys.size === 0) return;
    setBusy(true);
    setError(null);
    setSaved(false);

    // Defer past the paint so the spinner actually shows on large files.
    setTimeout(() => {
      try {
        const keys = [...selectedKeys];
        const diff = keyedDiff(fileA.headers, fileA.rows, fileB.headers, fileB.rows, keys);
        setResult(diff);

        let pairs: FuzzyPair[] = [];
        if (canFuzzy && diff.onlyInA.length && diff.onlyInB.length) {
          pairs = fuzzyPairKeys(
            diff.onlyInA,
            diff.onlyInB,
            keys.map((k) => fileA.headers.indexOf(k)).filter((i) => i !== -1),
            keys.map((k) => fileB.headers.indexOf(k)).filter((i) => i !== -1),
            threshold
          );
        }
        setFuzzy(pairs);
        setActiveTab(diff.onlyInA.length ? "onlyInA" : "onlyInB");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Comparison failed.");
      } finally {
        setBusy(false);
      }
    }, 0);
  }

  function save() {
    if (!result || !fileA || !fileB) return;
    startTransition(async () => {
      try {
        await saveReconciliation({
          asset_id: assetId,
          file_a_name: fileA.fileName,
          file_b_name: fileB.fileName,
          key_columns: [...selectedKeys],
          only_in_a: result.onlyInA.length,
          only_in_b: result.onlyInB.length,
          changed: result.changed.length,
          unchanged: result.unchanged.length,
          fuzzy_matched: fuzzy.length,
        });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save this run.");
      }
    });
  }

  function exportTab() {
    if (!result) return;
    const name = TAB_LABELS[activeTab].toLowerCase().replace(/\s+/g, "-");
    if (activeTab === "changed") {
      const headers = ["key", "column", "source", "target"];
      const rows = result.changed.flatMap((c) =>
        c.diffs.map((d) => [c.key, d.column, d.a, d.b])
      );
      downloadCSV(rowsToCSV(headers, rows), `${name}.csv`);
      return;
    }
    if (activeTab === "fuzzy") {
      const rows = fuzzy.map((p) => [p.keyA, p.keyB, p.score.toFixed(3)]);
      downloadCSV(rowsToCSV(["source_key", "target_key", "similarity"], rows), `${name}.csv`);
      return;
    }
    const rows =
      activeTab === "onlyInA" ? result.onlyInA
      : activeTab === "onlyInB" ? result.onlyInB
      : result.unchanged;
    downloadCSV(rowsToCSV(result.headers, rows), `${name}.csv`);
  }

  const counts: Record<Tab, number> = {
    onlyInA: result?.onlyInA.length ?? 0,
    onlyInB: result?.onlyInB.length ?? 0,
    changed: result?.changed.length ?? 0,
    unchanged: result?.unchanged.length ?? 0,
    fuzzy: fuzzy.length,
  };

  return (
    <div className="space-y-6">
      {/* Two-sided upload */}
      <div className="grid md:grid-cols-2 gap-4">
        {(["a", "b"] as const).map((side) => {
          const file = side === "a" ? fileA : fileB;
          return (
            <Card key={side} className="p-4 border border-[#EEF0F3] rounded-2xl space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  {side === "a" ? "Source (before)" : "Target (after)"}
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  {side === "a"
                    ? "The file you expect to be reproduced."
                    : "The file produced by the migration or pipeline."}
                </p>
              </div>
              {file ? (
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-slate-700 truncate">
                      {file.fileName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {file.rows.length.toLocaleString()} rows · {file.headers.length} columns
                    </p>
                  </div>
                  <button
                    onClick={() => (side === "a" ? setFileA(null) : setFileB(null))}
                    className="text-[12px] text-slate-500 hover:text-slate-700 shrink-0"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <UploadZone
                  label={`Drop the ${side === "a" ? "source" : "target"} file`}
                  sublabel="Parsed in your browser — neither file is uploaded."
                  onFile={(f) => load(f, side)}
                />
              )}
            </Card>
          );
        })}
      </div>

      {/* Key picker */}
      {fileA && fileB && (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Match rows on</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              The column(s) that identify the same record in both files.
              {sharedHeaders.length === 0 && " These two files share no column names."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sharedHeaders.map((h) => {
              const on = selectedKeys.has(h);
              return (
                <button
                  key={h}
                  onClick={() =>
                    setSelectedKeys((prev) => {
                      const next = new Set(prev);
                      if (next.has(h)) next.delete(h);
                      else next.add(h);
                      return next;
                    })
                  }
                  className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-full border transition-colors ${
                    on
                      ? "border-slate-800 bg-slate-800 text-white"
                      : "border-[#EEF0F3] bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {on ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  <span className="font-mono">{h}</span>
                </button>
              );
            })}
          </div>

          {canFuzzy && (
            <div className="flex items-center gap-3 pt-2 border-t border-[#F5F6F8]">
              <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label className="text-[12px] text-slate-600 shrink-0">
                Near-match sensitivity
              </label>
              <input
                type="range"
                min={0.6}
                max={0.99}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="flex-1 max-w-xs"
              />
              <span className="text-[12px] font-mono text-slate-500 w-10">
                {threshold.toFixed(2)}
              </span>
            </div>
          )}

          <button
            onClick={run}
            disabled={busy || selectedKeys.size === 0}
            className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#1A1A2E" }}
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompareArrows className="w-4 h-4" />}
            Reconcile
          </button>
        </Card>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
      )}

      {/* Results */}
      {result && (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(TAB_LABELS) as Tab[])
                .filter((t) => t !== "fuzzy" || canFuzzy)
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      activeTab === t
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-[#EEF0F3] bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {TAB_LABELS[t]}{" "}
                    <span className={activeTab === t ? "text-slate-300" : "text-slate-400"}>
                      {counts[t].toLocaleString()}
                    </span>
                  </button>
                ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportTab}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#EEF0F3] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={save}
                disabled={saved}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#00C9A7", color: "#0d1e33" }}
              >
                {saved ? "Saved" : "Save to history"}
              </button>
            </div>
          </div>

          <ResultTable result={result} fuzzy={fuzzy} tab={activeTab} />
          <p className="text-[11px] text-slate-400">
            Both files stay in your browser. Saving records the bucket counts and the key
            columns only — never the rows.
          </p>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Previous reconciliations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
                  <th className="font-medium py-2 pr-4">When</th>
                  <th className="font-medium py-2 pr-4">Files</th>
                  <th className="font-medium py-2 pr-4 text-right">Missing</th>
                  <th className="font-medium py-2 pr-4 text-right">New</th>
                  <th className="font-medium py-2 pr-4 text-right">Changed</th>
                  <th className="font-medium py-2 text-right">Unchanged</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b border-[#F5F6F8] last:border-0">
                    <td className="py-2.5 pr-4 text-slate-500">{formatDate(r.run_at)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 truncate max-w-[220px]">
                      {r.file_a_name} → {r.file_b_name}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-slate-700">{r.only_in_a}</td>
                    <td className="py-2.5 pr-4 text-right text-slate-700">{r.only_in_b}</td>
                    <td className="py-2.5 pr-4 text-right text-slate-700">{r.changed}</td>
                    <td className="py-2.5 text-right text-slate-500">{r.unchanged}</td>
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

function ResultTable({
  result,
  fuzzy,
  tab,
}: {
  result: DiffResult;
  fuzzy: FuzzyPair[];
  tab: Tab;
}) {
  const LIMIT = 200;

  if (tab === "fuzzy") {
    if (fuzzy.length === 0) {
      return <p className="text-sm text-slate-400">No near matches above the threshold.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
              <th className="font-medium py-2 pr-4">Source key</th>
              <th className="font-medium py-2 pr-4">Target key</th>
              <th className="font-medium py-2 text-right">Similarity</th>
            </tr>
          </thead>
          <tbody>
            {fuzzy.slice(0, LIMIT).map((p, i) => (
              <tr key={i} className="border-b border-[#F5F6F8] last:border-0">
                <td className="py-2 pr-4 font-mono text-slate-700">{p.keyA}</td>
                <td className="py-2 pr-4 font-mono text-slate-700">{p.keyB}</td>
                <td className="py-2 text-right text-slate-500">{(p.score * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (tab === "changed") {
    if (result.changed.length === 0) {
      return <p className="text-sm text-slate-400">No changed rows.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
              <th className="font-medium py-2 pr-4">Key</th>
              <th className="font-medium py-2 pr-4">Column</th>
              <th className="font-medium py-2 pr-4">Source</th>
              <th className="font-medium py-2">Target</th>
            </tr>
          </thead>
          <tbody>
            {result.changed.slice(0, LIMIT).flatMap((c) =>
              c.diffs.map((d, i) => (
                <tr key={`${c.key}-${i}`} className="border-b border-[#F5F6F8] last:border-0">
                  <td className="py-2 pr-4 font-mono text-slate-600">{c.key.replace(/\x00/g, " · ")}</td>
                  <td className="py-2 pr-4 font-mono text-slate-500">{d.column}</td>
                  <td className="py-2 pr-4 text-red-700 bg-red-50/40">{d.a || "—"}</td>
                  <td className="py-2 text-emerald-700 bg-emerald-50/40">{d.b || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  const rows =
    tab === "onlyInA" ? result.onlyInA
    : tab === "onlyInB" ? result.onlyInB
    : result.unchanged;

  if (rows.length === 0) return <p className="text-sm text-slate-400">Nothing in this bucket.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
            {result.headers.map((h) => (
              <th key={h} className="font-medium py-2 pr-4 font-mono whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, LIMIT).map((row, i) => (
            <tr key={i} className="border-b border-[#F5F6F8] last:border-0">
              {result.headers.map((_, j) => (
                <td key={j} className="py-2 pr-4 text-slate-600 whitespace-nowrap">
                  {row[j] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > LIMIT && (
        <p className="text-[11px] text-slate-400 mt-2">
          Showing the first {LIMIT.toLocaleString()} of {rows.length.toLocaleString()} — export for
          the full set.
        </p>
      )}
    </div>
  );
}
