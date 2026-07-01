"use client";

import { useState, useTransition } from "react";
import { SlidersHorizontal, RotateCcw, X } from "lucide-react";
import { useProfilingStore } from "@/store/profilingStore";
import { useRuleBuilderUIStore } from "@/store/ruleBuilderUIStore";
import { suggestRules } from "@/lib/ml/rule-suggester";
import { createRule } from "@/app/actions/rules";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COLUMN_PARAMS,
  RULE_TYPE_PARAMS,
  THRESHOLD_PRESETS,
  paramHint,
  paramValueToString,
  parseParamValue,
  thresholdModeForPct,
  type ThresholdMode,
} from "@/lib/dq-rule-meta";
import type { SuggestedRule } from "@/types/dq.types";

interface Props {
  assetId: string;
  existingRuleKeys: Set<string>; // "colName|dim|ruleType"
  columnNames: string[];
}

interface Override {
  threshold: string; // percent, e.g. "95"
  thresholdMode: ThresholdMode;
  params: Record<string, string>;
}

function buildOverride(s: SuggestedRule): Override {
  const thresholdPct = String(Math.round(s.threshold * 100));
  const params: Record<string, string> = {};
  for (const p of RULE_TYPE_PARAMS[s.rule_type] ?? []) {
    params[p] = paramValueToString(s.parameters[p]);
  }
  return { threshold: thresholdPct, thresholdMode: thresholdModeForPct(thresholdPct), params };
}

export function RuleSuggestionsPanel({ assetId, existingRuleKeys, columnNames }: Props) {
  const profiles = useProfilingStore((s) => s.profiles);
  const selectedColumn = useRuleBuilderUIStore((s) => s.selectedColumn);
  const setSelectedColumn = useRuleBuilderUIStore((s) => s.setSelectedColumn);
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [cardErrors, setCardErrors] = useState<Record<number, string>>({});
  const [, startTransition] = useTransition();

  if (!profiles || profiles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Upload and profile a file to see AI-powered rule suggestions.
      </div>
    );
  }

  const allSuggestions = suggestRules(profiles).filter((s) => {
    const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
    return !existingRuleKeys.has(key);
  });

  if (allSuggestions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        All suggested rules have already been added.
      </div>
    );
  }

  // Picking a column in the Data Preview table above filters this list down to
  // just that column. Indices stay relative to the full (unfiltered) list so
  // per-card state (accepted/overrides/errors) doesn't shift when the filter
  // is toggled on or off.
  const visibleSuggestions = allSuggestions
    .map((s, idx) => ({ suggestion: s, idx }))
    .filter(({ suggestion }) => !selectedColumn || suggestion.column_name === selectedColumn);

  function toggleExpanded(idx: number, suggestion: SuggestedRule) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
        setOverrides((p) => (p[idx] ? p : { ...p, [idx]: buildOverride(suggestion) }));
      }
      return next;
    });
  }

  function resetOverride(idx: number, suggestion: SuggestedRule) {
    setOverrides((prev) => ({ ...prev, [idx]: buildOverride(suggestion) }));
    setCardErrors((prev) => ({ ...prev, [idx]: "" }));
  }

  function setOverrideThreshold(idx: number, mode: ThresholdMode, value?: string) {
    setOverrides((prev) => {
      const current = prev[idx];
      if (!current) return prev;
      return {
        ...prev,
        [idx]: { ...current, thresholdMode: mode, threshold: value ?? current.threshold },
      };
    });
  }

  function setOverrideParam(idx: number, param: string, value: string) {
    setOverrides((prev) => {
      const current = prev[idx];
      if (!current) return prev;
      return { ...prev, [idx]: { ...current, params: { ...current.params, [param]: value } } };
    });
  }

  function handleAccept(idx: number, suggestion: SuggestedRule) {
    const ov = expanded.has(idx) ? overrides[idx] : undefined;

    let threshold = suggestion.threshold;
    let parameters: Record<string, unknown> = suggestion.parameters;

    if (ov) {
      const thresholdNum = parseFloat(ov.threshold) / 100;
      if (isNaN(thresholdNum) || thresholdNum < 0 || thresholdNum > 1) {
        setCardErrors((prev) => ({ ...prev, [idx]: "Threshold must be a number between 0 and 100." }));
        return;
      }
      threshold = thresholdNum;

      const paramKeys = RULE_TYPE_PARAMS[suggestion.rule_type] ?? [];
      if (paramKeys.length > 0) {
        const nextParams: Record<string, unknown> = {};
        for (const p of paramKeys) {
          const raw = ov.params[p] ?? "";
          if (!raw.trim()) {
            setCardErrors((prev) => ({ ...prev, [idx]: `Parameter "${p}" is required.` }));
            return;
          }
          nextParams[p] = parseParamValue(p, raw);
        }
        parameters = nextParams;
      }
    }

    setCardErrors((prev) => ({ ...prev, [idx]: "" }));
    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: suggestion.column_name,
          dimension: suggestion.dimension,
          rule_type: suggestion.rule_type,
          parameters,
          threshold,
          description: descriptions[idx]?.trim() || null,
          is_suggested: true,
        });
        setAccepted((prev) => new Set(prev).add(idx));
      } catch (err) {
        setCardErrors((prev) => ({
          ...prev,
          [idx]: err instanceof Error ? err.message : "Failed to add rule.",
        }));
      }
    });
  }

  function confidenceColor(c: number): string {
    if (c >= 0.85) return "text-green-600";
    if (c >= 0.7)  return "text-amber-600";
    return "text-slate-400";
  }

  return (
    <div className="space-y-2">
      {selectedColumn ? (
        <div className="flex items-center justify-between rounded-lg bg-mint/10 border border-mint/30 px-3 py-2 mb-3">
          <p className="text-xs text-slate-700">
            Showing suggestions for <span className="font-mono font-medium">{selectedColumn}</span>
          </p>
          <button
            type="button"
            onClick={() => setSelectedColumn(null)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <X className="w-3 h-3" />
            Show all columns
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 mb-3">
          {visibleSuggestions.length} suggestion{visibleSuggestions.length !== 1 ? "s" : ""} based on column profiles.
          Click <strong>Customize</strong> to adjust before accepting, or <strong>Accept</strong> to add as-is.
        </p>
      )}

      {visibleSuggestions.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No suggestions for this column.
        </div>
      )}

      {visibleSuggestions.slice(0, 20).map(({ suggestion: s, idx: i }) => {
        const isAccepted = accepted.has(i);
        const isExpanded = expanded.has(i);
        const ov = overrides[i];
        const paramKeys = RULE_TYPE_PARAMS[s.rule_type] ?? [];
        const error = cardErrors[i];
        return (
          <div
            key={`${s.column_name}-${s.dimension}-${s.rule_type}`}
            className={`rounded-lg border px-4 py-3 transition-colors ${
              isAccepted
                ? "border-mint/40 bg-mint/5"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800">
                    {s.rule_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{s.column_name}</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 capitalize">
                    {s.dimension}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{s.reason}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-medium ${confidenceColor(s.confidence)}`}>
                    {Math.round(s.confidence * 100)}% confidence
                  </span>
                  <span className="text-xs text-slate-400">
                    threshold {isExpanded && ov ? Math.round(parseFloat(ov.threshold) || 0) : Math.round(s.threshold * 100)}%
                  </span>
                </div>
                {!isAccepted && (
                  <input
                    type="text"
                    placeholder="Add a description (optional)…"
                    value={descriptions[i] ?? ""}
                    onChange={(e) =>
                      setDescriptions((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    className="mt-2 flex h-7 w-full max-w-sm rounded-md border border-input bg-transparent px-2 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                )}
              </div>

              {isAccepted ? (
                <span className="shrink-0 text-xs font-medium text-mint mt-1">Added</span>
              ) : (
                <div className="flex shrink-0 items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(i, s)}
                    title="Customize before accepting"
                    aria-expanded={isExpanded}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                      isExpanded
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    Customize
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccept(i, s)}
                    className="rounded-lg border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>

            {/* Customize panel */}
            {!isAccepted && isExpanded && ov && (
              <div className="mt-3 space-y-3 rounded-lg border border-violet-100 bg-violet-50/30 p-3">
                {/* Threshold */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-600">Threshold</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {THRESHOLD_PRESETS.map(({ key, value, label }) => {
                      const isSelected = ov.thresholdMode === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOverrideThreshold(i, key, value ?? ov.threshold)}
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          {label}{value ? ` ${value}%` : ""}
                        </button>
                      );
                    })}
                  </div>
                  {ov.thresholdMode === "custom" && (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      value={ov.threshold}
                      onChange={(e) => setOverrideThreshold(i, "custom", e.target.value)}
                      placeholder="e.g. 90"
                    />
                  )}
                </div>

                {/* Parameters */}
                {paramKeys.map((param) => (
                  <div key={param} className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-600">
                      {param.replace(/_/g, " ")}
                    </label>
                    {COLUMN_PARAMS.has(param) ? (
                      <Select
                        value={ov.params[param] ?? ""}
                        onValueChange={(v) => {
                          if (v !== null) setOverrideParam(i, param, v);
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select column…" />
                        </SelectTrigger>
                        <SelectContent>
                          {columnNames
                            .filter((c) => c !== s.column_name)
                            .map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        type="text"
                        className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        placeholder={paramHint(param)}
                        value={ov.params[param] ?? ""}
                        onChange={(e) => setOverrideParam(i, param, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => resetOverride(i, s)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to AI suggestion
                </button>
              </div>
            )}

            {error && (
              <p className="mt-2 rounded-md bg-red-50 px-2.5 py-1.5 text-[11px] text-red-600">{error}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
