"use client";

import { Plus, Minus, Equal } from "lucide-react";

interface SchemaDiff {
  added: string[];
  removed: string[];
  unchanged: string[];
}

interface ColumnComparisonTableProps {
  currentHeaders: string[];
  previousHeaders: string[] | null;
}

function computeDiff(current: string[], previous: string[] | null): SchemaDiff {
  if (!previous || previous.length === 0) {
    return { added: [], removed: [], unchanged: current };
  }
  const prevSet = new Set(previous);
  const curSet = new Set(current);

  return {
    added: current.filter((c) => !prevSet.has(c)),
    removed: previous.filter((c) => !curSet.has(c)),
    unchanged: current.filter((c) => prevSet.has(c)),
  };
}

export function ColumnComparisonTable({
  currentHeaders,
  previousHeaders,
}: ColumnComparisonTableProps) {
  const diff = computeDiff(currentHeaders, previousHeaders);
  const hasChanges = diff.added.length > 0 || diff.removed.length > 0;
  const isFirstRun = !previousHeaders || previousHeaders.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Schema{" "}
          {isFirstRun ? (
            <span className="font-normal text-slate-400">— first run</span>
          ) : hasChanges ? (
            <span className="text-amber-600">— changed</span>
          ) : (
            <span className="font-normal text-slate-400">— no changes</span>
          )}
        </h3>
        <span className="text-xs text-slate-400">{currentHeaders.length} columns</span>
      </div>

      {hasChanges && (
        <div className="flex gap-4 text-xs">
          {diff.added.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Plus className="w-3 h-3" />
              {diff.added.length} added
            </span>
          )}
          {diff.removed.length > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              <Minus className="w-3 h-3" />
              {diff.removed.length} removed
            </span>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Column
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {diff.added.map((col, i) => (
                <tr key={`added-${col || i}`} className="bg-emerald-50">
                  <td className="px-4 py-2 font-mono text-xs text-emerald-800">{col}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <Plus className="w-3 h-3" />Added
                    </span>
                  </td>
                </tr>
              ))}
              {diff.removed.map((col, i) => (
                <tr key={`removed-${col || i}`} className="bg-red-50">
                  <td className="px-4 py-2 font-mono text-xs text-red-800">{col}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 text-xs text-red-700 font-medium">
                      <Minus className="w-3 h-3" />Removed
                    </span>
                  </td>
                </tr>
              ))}
              {diff.unchanged.map((col, i) => (
                <tr key={`unchanged-${col || i}`}>
                  <td className="px-4 py-2 font-mono text-xs text-slate-600">{col}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Equal className="w-3 h-3" />Same
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
