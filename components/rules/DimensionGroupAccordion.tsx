"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import type { DQRule } from "@/types/app.types";
import { deleteRule, toggleRule, updateRule } from "@/app/actions/rules";

const DIMENSION_COLORS: Record<string, string> = {
  completeness: "bg-blue-100 text-blue-700",
  validity:     "bg-purple-100 text-purple-700",
  accuracy:     "bg-green-100 text-green-700",
  uniqueness:   "bg-yellow-100 text-yellow-700",
  consistency:  "bg-orange-100 text-orange-700",
  integrity:    "bg-red-100 text-red-700",
  timeliness:   "bg-teal-100 text-teal-700",
  currency:     "bg-cyan-100 text-cyan-700",
  conformity:   "bg-indigo-100 text-indigo-700",
  precision:    "bg-pink-100 text-pink-700",
};

interface Props {
  rules: DQRule[];
  assetId: string;
  orphanedRuleIds?: string[];
  columnNames?: string[];
}

export function DimensionGroupAccordion({ rules, assetId, orphanedRuleIds = [], columnNames = [] }: Props) {
  const orphanedSet = new Set(orphanedRuleIds);
  const [openDimensions, setOpenDimensions] = useState<Set<string>>(
    () => new Set(["completeness", "validity"])
  );
  const [, startTransition] = useTransition();

  const byDimension = rules.reduce<Record<string, DQRule[]>>((acc, r) => {
    const arr = acc[r.dimension] ?? [];
    arr.push(r);
    acc[r.dimension] = arr;
    return acc;
  }, {});

  const dimensions = Object.keys(byDimension).sort();

  function toggleDimension(dim: string) {
    setOpenDimensions((prev) => {
      const next = new Set(prev);
      next.has(dim) ? next.delete(dim) : next.add(dim);
      return next;
    });
  }

  function handleToggleRule(rule: DQRule) {
    startTransition(() => {
      toggleRule(rule.id, !rule.is_active, assetId);
    });
  }

  function handleDeleteRule(ruleId: string) {
    if (!confirm("Delete this rule?")) return;
    startTransition(() => {
      deleteRule(ruleId, assetId);
    });
  }

  function handleMapRule(ruleId: string, newColumnName: string) {
    startTransition(() => {
      updateRule(ruleId, { column_name: newColumnName });
    });
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No rules yet. Use &quot;Add Rule&quot; or accept AI Rule Identifier suggestions to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {dimensions.map((dim) => {
        const dimRules = byDimension[dim];
        const isOpen = openDimensions.has(dim);
        const activeCount = dimRules.filter((r) => r.is_active).length;

        return (
          <div key={dim} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            {/* Header */}
            <button
              type="button"
              onClick={() => toggleDimension(dim)}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    DIMENSION_COLORS[dim] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {dim}
                </span>
                <span className="text-sm text-slate-500">
                  {activeCount}/{dimRules.length} active
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Rule rows */}
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {dimRules.map((rule) => {
                  const isOrphaned = orphanedSet.has(rule.id);
                  return (
                    <div
                      key={rule.id}
                      className={`flex items-start gap-3 px-4 py-3 ${
                        isOrphaned ? "bg-amber-50" : rule.is_active ? "" : "opacity-50"
                      }`}
                    >
                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule)}
                        className={`relative inline-flex h-5 w-9 mt-0.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                          rule.is_active ? "bg-[#00C9A7]" : "bg-slate-200"
                        }`}
                        title={rule.is_active ? "Disable rule" : "Enable rule"}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                            rule.is_active ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>

                      {/* Rule info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isOrphaned && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-slate-800 truncate">
                            {rule.rule_type.replace(/_/g, " ")}
                          </span>
                          {rule.column_name && (
                            <span className={`text-xs font-mono truncate ${isOrphaned ? "text-amber-600" : "text-slate-400"}`}>
                              {rule.column_name}
                              {isOrphaned && " (column missing)"}
                            </span>
                          )}
                          {rule.is_suggested && (
                            <span className="inline-flex items-center rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400">
                            threshold {Math.round(rule.threshold * 100)}%
                          </span>
                          {Object.keys(rule.parameters ?? {}).length > 0 && (
                            <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                              {JSON.stringify(rule.parameters)}
                            </span>
                          )}
                        </div>

                        {/* Orphaned rule actions — shown inline below rule info */}
                        {isOrphaned && (
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) handleMapRule(rule.id, e.target.value);
                              }}
                              className="text-xs border border-amber-300 rounded-md px-2 py-1 bg-white text-amber-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
                            >
                              <option value="" disabled>Map to column →</option>
                              {columnNames.map((col) => (
                                <option key={col} value={col}>{col}</option>
                              ))}
                            </select>
                            <span className="text-xs text-amber-400">or</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-xs px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                              Remove rule
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Delete icon — only for non-orphaned rules */}
                      {!isOrphaned && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="shrink-0 p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete rule"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
