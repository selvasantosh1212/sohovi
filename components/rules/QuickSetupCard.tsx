"use client";

import { useState, useTransition } from "react";
import { Sparkles, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useProfilingStore } from "@/store/profilingStore";
import { suggestRules } from "@/lib/ml/rule-suggester";
import { createRule } from "@/app/actions/rules";
import type { SuggestedRule } from "@/types/dq.types";

interface Props {
  assetId: string;
  existingRuleKeys: Set<string>;
  hasFewRules: boolean;
}

export function QuickSetupCard({ assetId, existingRuleKeys, hasFewRules }: Props) {
  const profiles = useProfilingStore((s) => s.profiles);
  const [dismissed, setDismissed] = useState(false);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [, startTransition] = useTransition();

  if (!profiles || profiles.length === 0 || !hasFewRules || dismissed) return null;

  const suggestions = suggestRules(profiles)
    .filter((s) => s.confidence >= 0.70)
    .filter((s) => !existingRuleKeys.has(`${s.column_name}|${s.dimension}|${s.rule_type}`))
    .filter((s) => !accepted.has(`${s.column_name}|${s.dimension}|${s.rule_type}`));

  if (suggestions.length === 0) return null;

  const highConfidence = suggestions.filter((s) => s.confidence >= 0.85);
  const visible = expanded ? suggestions : suggestions.slice(0, 5);

  function handleAccept(s: SuggestedRule) {
    const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: s.column_name,
          dimension: s.dimension,
          rule_type: s.rule_type,
          parameters: s.parameters,
          threshold: s.threshold,
          is_suggested: true,
        });
        setAccepted((prev) => new Set([...prev, key]));
      } catch {
        // silently ignore — user can retry
      }
    });
  }

  function handleAcceptAll() {
    for (const s of highConfidence) handleAccept(s);
  }

  return (
    <div className="rounded-xl border border-[#00C9A7]/40 bg-gradient-to-br from-[#00C9A7]/5 to-white p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#00C9A7] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Smart Start — {suggestions.length} rule{suggestions.length !== 1 ? "s" : ""} suggested for your data
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on column names and data patterns. Accept rules you want, then run your DQ check.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Accept all */}
      {highConfidence.length > 0 && (
        <button
          type="button"
          onClick={handleAcceptAll}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#1E3A5F" }}
        >
          <Check className="w-3.5 h-3.5" />
          Accept All High-Confidence ({highConfidence.length})
        </button>
      )}

      {/* Suggestion rows */}
      <div className="space-y-1.5">
        {visible.map((s) => {
          const key = `${s.column_name}|${s.dimension}|${s.rule_type}`;
          const isAccepted = accepted.has(key);
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isAccepted
                  ? "border-[#00C9A7]/30 bg-[#00C9A7]/5"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-[#1E3A5F] shrink-0">{s.column_name}</span>
                  <span className="text-xs text-slate-700">{s.rule_type.replace(/_/g, " ")}</span>
                  <span className="text-[10px] text-slate-400 capitalize hidden sm:inline">{s.dimension}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{s.reason}</p>
              </div>
              <span className={`text-[10px] font-semibold shrink-0 ${
                s.confidence >= 0.85 ? "text-emerald-600" : "text-amber-500"
              }`}>
                {Math.round(s.confidence * 100)}%
              </span>
              {isAccepted ? (
                <span className="shrink-0 text-[10px] font-semibold text-[#00C9A7]">Added ✓</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAccept(s)}
                  className="shrink-0 rounded-md border border-[#1E3A5F]/30 px-2.5 py-1 text-[11px] font-medium text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors"
                >
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more / less */}
      {suggestions.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Show less" : `Show ${suggestions.length - 5} more suggestions`}
        </button>
      )}
    </div>
  );
}
