"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { RuleResult } from "@/types/dq.types";
import { getFriendlyMessage, renderFriendly } from "@/lib/dq-engine/friendly-messages";

interface Props {
  ruleResults: RuleResult[];
  headers: string[];
  rows: (string | null)[][];
  columnFilter?: string | null;
}

const PAGE_SIZE = 20;

export function FailedRecordsTable({ ruleResults, headers, rows, columnFilter }: Props) {
  const [page, setPage] = useState(0);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const failedRules = ruleResults.filter(
    (r) =>
      r.failed_indices.length > 0 &&
      (!columnFilter || r.column_name === columnFilter)
  );

  if (failedRules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
        {columnFilter
          ? `No failed records for "${columnFilter}".`
          : "No failed records — all rules passed."}
      </div>
    );
  }

  const activeRule =
    failedRules.find((r) => r.rule_id === selectedRule) ?? failedRules[0];

  const failedRows = activeRule.failed_indices
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map((idx) => ({ idx, cells: rows[idx] ?? [] }));

  const totalFailed = activeRule.failed_indices.length;
  const totalPages = Math.ceil(totalFailed / PAGE_SIZE);

  const allFailedCount = new Set(failedRules.flatMap((r) => r.failed_indices)).size;

  const relevantColIdx = activeRule.column_name
    ? headers.indexOf(activeRule.column_name)
    : -1;

  const displayCols =
    headers.length <= 8
      ? headers.map((h, i) => ({ name: h, idx: i }))
      : relevantColIdx >= 0
      ? [
          ...headers
            .map((h, i) => ({ name: h, idx: i }))
            .filter(
              (c) =>
                c.idx === relevantColIdx ||
                c.idx === relevantColIdx - 1 ||
                c.idx === relevantColIdx + 1 ||
                c.idx === 0
            )
            .slice(0, 6),
        ]
      : headers.slice(0, 6).map((h, i) => ({ name: h, idx: i }));

  function downloadCSV() {
    const ruleFailureMap = new Map<number, string[]>();
    for (const rule of failedRules) {
      for (const idx of rule.failed_indices) {
        if (!ruleFailureMap.has(idx)) ruleFailureMap.set(idx, []);
        ruleFailureMap.get(idx)!.push(rule.rule_type.replace(/_/g, " "));
      }
    }
    const sortedIndices = Array.from(ruleFailureMap.keys()).sort((a, b) => a - b);
    const allCols = headers.map((h, i) => ({ name: h, idx: i }));
    const headerRow = [
      "Row",
      '"Rules Violated"',
      ...allCols.map((c) => `"${c.name.replace(/"/g, '""')}"`),
    ].join(",");
    const dataRows = sortedIndices.map((idx) => {
      const cells = rows[idx] ?? [];
      const ruleNames = (ruleFailureMap.get(idx) ?? []).join("; ");
      return [
        idx + 1,
        `"${ruleNames.replace(/"/g, '""')}"`,
        ...allCols.map((c) => {
          const v = cells[c.idx] ?? "";
          return `"${String(v).replace(/"/g, '""')}"`;
        }),
      ].join(",");
    });
    const csv = [headerRow, ...dataRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `failed_records_all.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      {/* Rule selector + download */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {failedRules.map((r) => (
            <button
              key={r.rule_id}
              type="button"
              onClick={() => {
                setSelectedRule(r.rule_id);
                setPage(0);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                (selectedRule ?? failedRules[0].rule_id) === r.rule_id
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.rule_type.replace(/_/g, " ")} ({r.failed_records.toLocaleString()})
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={downloadCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV ({allFailedCount.toLocaleString()} rows)
        </button>
      </div>

      {/* Friendly summary */}
      {(() => {
        const friendly = getFriendlyMessage(activeRule);
        return friendly ? (
          <p className="text-sm text-slate-700 font-medium leading-snug">
            {renderFriendly(friendly).map((part, i) =>
              part.bold
                ? <strong key={i} className="font-semibold">{part.text}</strong>
                : <span key={i}>{part.text}</span>
            )}
          </p>
        ) : null;
      })()}
      <p className="text-xs text-slate-400 font-mono">
        {totalFailed.toLocaleString()} failed record{totalFailed !== 1 ? "s" : ""} · {activeRule.message}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-500 w-12">#</th>
              {displayCols.map((col) => (
                <th
                  key={col.idx}
                  className={`px-3 py-2 text-left font-semibold truncate max-w-[140px] ${
                    col.idx === relevantColIdx ? "text-red-600" : "text-slate-500"
                  }`}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {failedRows.map(({ idx, cells }) => (
              <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                {displayCols.map((col) => (
                  <td
                    key={col.idx}
                    className={`px-3 py-2 font-mono truncate max-w-[140px] ${
                      col.idx === relevantColIdx
                        ? "text-red-600 bg-red-50/40 font-medium"
                        : "text-slate-600"
                    }`}
                  >
                    {cells[col.idx] ?? (
                      <span className="text-slate-300 italic">null</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalFailed)} of{" "}
            {totalFailed.toLocaleString()}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded px-2 py-1 border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded px-2 py-1 border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
