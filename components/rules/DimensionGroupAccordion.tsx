"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Filter, Workflow as WorkflowIcon } from "lucide-react";
import type { DQRule, DQDimension } from "@/types/app.types";
import { deleteRule, toggleRule, updateRule } from "@/app/actions/rules";
import { Tooltip } from "@/components/ui/tooltip";
import { DIMENSION_COLORS } from "@/lib/dq-engine/dimension-meta";
import { formatScopeConditions } from "@/lib/dq-engine/format-scope-conditions";
import { SaveAsWorkflowDialog } from "@/components/workflows/SaveAsWorkflowDialog";

function formatRuleParam(ruleType: string, params: Record<string, unknown>): string {
  switch (ruleType) {
    case "freshness_check":
    case "recent_update":
    case "not_stale":
      return params.max_age_days ? `≤ ${params.max_age_days} days` : "";
    case "enum_validation": {
      const vals = params.allowed_values;
      if (Array.isArray(vals)) return (vals as string[]).slice(0, 5).join(" · ");
      return "";
    }
    case "regex_match":
      return params.pattern ? `regex: ${params.pattern}` : "";
    case "value_equals":
      return params.expected_value !== undefined ? `= ${params.expected_value}` : "";
    case "format_check":
    case "datatype_enforcement":
      return String(params.template ?? params.expected_type ?? "");
    case "datatype_check":
      return String(params.expected_type ?? "");
    case "range_check":
      return params.min !== undefined && params.max !== undefined
        ? `${params.min} – ${params.max}`
        : params.min !== undefined ? `≥ ${params.min}` : params.max !== undefined ? `≤ ${params.max}` : "";
    case "case_consistency":
      return String(params.case ?? "").toUpperCase();
    case "cross_column_match":
    case "no_orphan_values":
    case "referential_integrity":
    case "sequence_validation":
    case "cross_field_comparison":
      return params.reference_column ? `vs ${params.reference_column}` : "";
    case "decimal_places":
    case "rounding_check":
      return params.max_decimals !== undefined
        ? `≤ ${params.max_decimals} dp`
        : params.decimals !== undefined ? `${params.decimals} dp` : "";
    case "conditional_not_null":
      return params.if_column && params.if_value
        ? `if ${params.if_column} = ${params.if_value}` : "";
    default:
      return "";
  }
}

interface Props {
  rules: DQRule[];
  assetId: string;
  orphanedRuleIds?: string[];
  columnNames?: string[];
}

export function DimensionGroupAccordion({ rules, assetId, orphanedRuleIds = [], columnNames = [] }: Props) {
  const router = useRouter();
  const orphanedSet = new Set(orphanedRuleIds);
  const [openDimensions, setOpenDimensions] = useState<Set<string>>(
    () => new Set(["completeness", "validity"])
  );
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(new Set());
  const [saveAsWorkflowOpen, setSaveAsWorkflowOpen] = useState(false);
  const [, startTransition] = useTransition();

  function toggleSelected(ruleId: string) {
    setSelectedRuleIds((prev) => {
      const next = new Set(prev);
      next.has(ruleId) ? next.delete(ruleId) : next.add(ruleId);
      return next;
    });
  }

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
    startTransition(async () => {
      try {
        await toggleRule(rule.id, !rule.is_active, assetId);
        router.refresh();
      } catch {
        // silently fail — server action's revalidatePath will still fire
      }
    });
  }

  function handleDeleteRule(ruleId: string) {
    if (!confirm("Delete this rule?")) return;
    startTransition(async () => {
      try {
        await deleteRule(ruleId, assetId);
        router.refresh();
      } catch {
        // silently fail
      }
    });
  }

  function handleMapRule(ruleId: string, newColumnName: string) {
    startTransition(async () => {
      try {
        await updateRule(ruleId, { column_name: newColumnName });
        router.refresh();
      } catch {
        // silently fail
      }
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
      {selectedRuleIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5">
          <p className="text-xs font-medium text-teal-800">
            {selectedRuleIds.size} rule{selectedRuleIds.size !== 1 ? "s" : ""} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedRuleIds(new Set())}
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setSaveAsWorkflowOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <WorkflowIcon className="w-3.5 h-3.5" />
              Save as Workflow
            </button>
          </div>
        </div>
      )}

      <SaveAsWorkflowDialog
        open={saveAsWorkflowOpen}
        onOpenChange={setSaveAsWorkflowOpen}
        ruleIds={Array.from(selectedRuleIds)}
        sourceAssetId={assetId}
        onSaved={() => setSelectedRuleIds(new Set())}
      />

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
                    DIMENSION_COLORS[dim as DQDimension] ?? "bg-slate-100 text-slate-700"
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
                      {/* Select for Save as Workflow */}
                      <input
                        type="checkbox"
                        checked={selectedRuleIds.has(rule.id)}
                        onChange={() => toggleSelected(rule.id)}
                        className="mt-1.5 shrink-0 h-3.5 w-3.5 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                        aria-label="Select rule"
                      />

                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule)}
                        className={`relative inline-flex h-5 w-9 mt-0.5 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent ${
                          rule.is_active
                            ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
                            : "bg-slate-400 border-slate-400 hover:bg-slate-500 hover:border-slate-500"
                        }`}
                        title={rule.is_active ? "Disable rule" : "Enable rule"}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-900/10 transform transition-transform ${
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
                          {rule.source_workflow_id && (
                            <Tooltip content="Created by applying a Workflow">
                              <Link
                                href={`/dashboard/workflows/${rule.source_workflow_id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 hover:bg-sky-200"
                              >
                                <WorkflowIcon className="w-2.5 h-2.5" />
                                From Workflow
                              </Link>
                            </Tooltip>
                          )}
                          {rule.scope_conditions.length > 0 && (
                            <Tooltip content={formatScopeConditions(rule.scope_conditions)}>
                              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 cursor-help">
                                <Filter className="w-2.5 h-2.5" />
                                Scoped
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400">
                            threshold {Math.round(rule.threshold * 100)}%
                          </span>
                          {(() => {
                            const label = formatRuleParam(
                              rule.rule_type,
                              (rule.parameters ?? {}) as Record<string, unknown>
                            );
                            return label ? (
                              <span className="text-xs text-slate-400 truncate max-w-[200px]">{label}</span>
                            ) : null;
                          })()}
                        </div>

                        {rule.description && (
                          <p className="text-xs text-slate-400 italic mt-1">{rule.description}</p>
                        )}

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
