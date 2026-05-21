"use client";

import { useState, useTransition } from "react";
import { useProfilingStore } from "@/store/profilingStore";
import { suggestRules } from "@/lib/ml/rule-suggester";
import { createRule } from "@/app/actions/rules";
import type { SuggestedRule } from "@/types/dq.types";

interface Props {
  assetId: string;
  existingRuleKeys: Set<string>; // "colName|dim|ruleType"
}

export function RuleSuggestionsPanel({ assetId, existingRuleKeys }: Props) {
  const profiles = useProfilingStore((s) => s.profiles);
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const [, startTransition] = useTransition();

  if (!profiles || profiles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Upload and profile a file to see AI-powered rule suggestions.
      </div>
    );
  }

  const suggestions = suggestRules(profiles).filter((s) => {
    const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
    return !existingRuleKeys.has(key);
  });

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        All suggested rules have already been added.
      </div>
    );
  }

  function handleAccept(idx: number, suggestion: SuggestedRule) {
    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: suggestion.column_name,
          dimension: suggestion.dimension,
          rule_type: suggestion.rule_type,
          parameters: suggestion.parameters,
          threshold: suggestion.threshold,
          is_suggested: true,
        });
        setAccepted((prev) => new Set(prev).add(idx));
      } catch {
        // silently fail — user can retry
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
      <p className="text-xs text-slate-500 mb-3">
        {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""} based on column profiles.
        Click <strong>Accept</strong> to add a rule.
      </p>
      {suggestions.slice(0, 20).map((s, i) => {
        const isAccepted = accepted.has(i);
        return (
          <div
            key={`${s.column_name}-${s.dimension}-${s.rule_type}`}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              isAccepted
                ? "border-[#00C9A7]/40 bg-[#00C9A7]/5"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
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
                  threshold {Math.round(s.threshold * 100)}%
                </span>
              </div>
            </div>

            {isAccepted ? (
              <span className="shrink-0 text-xs font-medium text-[#00C9A7] mt-1">Added</span>
            ) : (
              <button
                type="button"
                onClick={() => handleAccept(i, s)}
                className="shrink-0 rounded-lg border border-[#1E3A5F] px-3 py-1 text-xs font-medium text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors mt-0.5"
              >
                Accept
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
