"use client";

import { useState, useEffect, useTransition } from "react";
import { Lightbulb, CheckCircle2, X, AlertTriangle, Sparkles } from "lucide-react";
import { createRule } from "@/app/actions/rules";
import { parseRulesFromDescription } from "@/lib/ml/nl-rule-parser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DQDimension, DQRule } from "@/types/app.types";
import type { SuggestedRule } from "@/types/dq.types";
import { useProfilingStore } from "@/store/profilingStore";
import { getRuleExample, type RuleExample } from "@/lib/dq-rule-examples";
import type { DetectedDateFormat } from "@/types/profiling.types";

const DIMENSIONS: DQDimension[] = [
  "completeness", "validity", "accuracy", "uniqueness",
  "consistency", "integrity", "timeliness", "currency",
  "conformity", "precision",
];

// Map dimension → available rule types
const RULE_TYPES: Record<DQDimension, { value: string; label: string; params?: string[] }[]> = {
  completeness: [
    { value: "not_null",             label: "Not Null" },
    { value: "not_empty",            label: "Not Empty" },
    { value: "mandatory_column",     label: "Mandatory Column" },
    { value: "conditional_not_null", label: "Conditional Not Null", params: ["if_column", "if_value"] },
  ],
  validity: [
    { value: "regex_match",       label: "Regex Match",      params: ["pattern"] },
    { value: "enum_validation",   label: "Enum Validation",  params: ["allowed_values"] },
    { value: "datatype_check",    label: "Datatype Check",   params: ["expected_type"] },
    { value: "sequence_validation", label: "Sequence Check", params: ["col_b", "operator"] },
  ],
  accuracy: [
    { value: "range_check",            label: "Range Check",          params: ["min", "max"] },
    { value: "positive_check",         label: "Positive Check" },
    { value: "cross_field_comparison", label: "Cross-Field Compare",  params: ["col_b", "operator"] },
  ],
  uniqueness: [
    { value: "unique_column",      label: "Unique Column" },
    { value: "duplicate_detection", label: "Duplicate Detection" },
  ],
  consistency: [
    { value: "format_standardization", label: "Format Standardization" },
    { value: "case_consistency",       label: "Case Consistency",      params: ["case"] },
    { value: "cross_column_match",     label: "Cross-Column Match",    params: ["col_b", "pattern"] },
  ],
  integrity: [
    { value: "no_orphan_values",    label: "No Orphan Values",    params: ["reference_column"] },
    { value: "referential_integrity", label: "Referential Integrity", params: ["reference_column"] },
  ],
  timeliness: [
    { value: "freshness_check",  label: "Freshness Check", params: ["max_age_days"] },
    { value: "not_future_date",  label: "Not Future Date" },
  ],
  currency: [
    { value: "recent_update", label: "Recent Update", params: ["max_age_days"] },
    { value: "not_stale",     label: "Not Stale",     params: ["max_age_days"] },
  ],
  conformity: [
    { value: "format_check",          label: "Format Check",          params: ["template"] },
    { value: "datatype_enforcement",  label: "Datatype Enforcement",  params: ["expected_type"] },
  ],
  precision: [
    { value: "decimal_places",  label: "Decimal Places",  params: ["max_decimals"] },
    { value: "rounding_check",  label: "Rounding Check",  params: ["decimals"] },
  ],
};

interface Props {
  assetId: string;
  columnNames: string[];
  initialColumn?: string;
  existingRules?: DQRule[];
}

export function RuleBuilderPanel({ assetId, columnNames, initialColumn, existingRules = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [dimension, setDimension] = useState<DQDimension>("completeness");
  const [ruleType, setRuleType] = useState("not_null");
  const [columnName, setColumnName] = useState(initialColumn ?? columnNames[0] ?? "");
  const [threshold, setThreshold] = useState("95");
  const [thresholdMode, setThresholdMode] = useState<"strict" | "standard" | "lenient" | "custom">("standard");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, startTransition] = useTransition();

  // AI Builder state
  const [aiDescription, setAiDescription] = useState("");
  const [aiResults, setAiResults] = useState<SuggestedRule[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [acceptedRules, setAcceptedRules] = useState<Set<number>>(new Set());

  // Profiling store — resolve active column profile for date format detection
  const profiles = useProfilingStore((s) => s.profiles);
  const activeProfile = profiles?.find((p) => p.column_name === columnName) ?? null;
  const dateFormats = activeProfile?.detected_date_formats ?? null;
  const isDateColumn =
    activeProfile?.inferred_type === "date" || activeProfile?.inferred_type === "datetime";

  const availableRuleTypes = RULE_TYPES[dimension] ?? [];
  const selectedRuleType = availableRuleTypes.find((r) => r.value === ruleType);
  const requiredParams = selectedRuleType?.params ?? [];

  // Detect if a rule for the same column+dimension already exists with a different rule_type
  const conflictingRule = existingRules.find(
    (r) =>
      r.column_name === (columnName || null) &&
      r.dimension === dimension &&
      r.rule_type !== ruleType
  );

  // Auto-populate template param for conformity > format_check when a date column
  // has a high-confidence detected format
  useEffect(() => {
    if (
      dimension === "conformity" &&
      ruleType === "format_check" &&
      isDateColumn &&
      dateFormats &&
      dateFormats.length > 0 &&
      dateFormats[0].confidence > 0.8
    ) {
      setParamValues((prev) => ({
        ...prev,
        template: dateFormats[0].templateKey,
      }));
    }
  }, [dimension, ruleType, isDateColumn, dateFormats]);

  function handleDimensionChange(val: string | null) {
    const d = (val ?? "completeness") as DQDimension;
    setDimension(d);
    const first = RULE_TYPES[d]?.[0]?.value ?? "";
    setRuleType(first);
    setParamValues({});
    setError(null);
    setSuccess(false);
  }

  function handleRuleTypeChange(val: string | null) {
    setRuleType(val ?? "");
    setParamValues({});
    setError(null);
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const thresholdNum = parseFloat(threshold) / 100;
    if (isNaN(thresholdNum) || thresholdNum < 0 || thresholdNum > 1) {
      setError("Threshold must be a number between 0 and 100.");
      return;
    }

    // Build parameters
    const parameters: Record<string, unknown> = {};
    for (const param of requiredParams) {
      const raw = paramValues[param] ?? "";
      if (!raw.trim()) {
        setError(`Parameter "${param}" is required.`);
        return;
      }
      const num = Number(raw);
      if (!isNaN(num) && raw.trim() !== "") {
        parameters[param] = num;
      } else if (param === "allowed_values") {
        parameters[param] = raw.split(",").map((v) => v.trim());
      } else {
        parameters[param] = raw;
      }
    }

    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: columnName || null,
          dimension,
          rule_type: ruleType,
          parameters,
          threshold: thresholdNum,
        });
        setSuccess(true);
        setParamValues({});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create rule.");
      }
    });
  }

  function handleAiGenerate() {
    if (!aiDescription.trim() || !columnName) return;
    setAiError(null);
    setAiResults([]);
    setAcceptedRules(new Set());
    const inferredType = activeProfile?.inferred_type ?? "string";
    const rules = parseRulesFromDescription(aiDescription, columnName, inferredType);
    if (rules.length === 0) {
      setAiError("No rules matched. Try describing a specific constraint — e.g. \"must not be blank\", \"must be a valid email\", \"must be between 0 and 1000\".");
    } else {
      setAiResults(rules);
    }
  }

  function handleAcceptRule(rule: SuggestedRule, index: number) {
    startTransition(async () => {
      try {
        await createRule({
          asset_id: assetId,
          column_name: rule.column_name || null,
          dimension: rule.dimension,
          rule_type: rule.rule_type,
          parameters: rule.parameters,
          threshold: rule.threshold,
        });
        setAcceptedRules((prev) => new Set([...prev, index]));
      } catch {
        // silently ignore per-card errors; user can retry
      }
    });
  }

  const example = getRuleExample(dimension, ruleType);
  const hasMixedFormats =
    dateFormats !== null &&
    dateFormats.filter((f) => f.matchPct > 10).length > 1;

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-2 transition-colors ${
            activeTab === "manual"
              ? "bg-[#1E3A5F] text-white"
              : "bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "ai"
              ? "bg-[#1E3A5F] text-white"
              : "bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          AI Builder
        </button>
      </div>

      {activeTab === "ai" ? (
        <div className="space-y-4">
          {/* Column selector (shared with manual) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Column</label>
            <Select value={columnName} onValueChange={(v) => setColumnName(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column…" />
              </SelectTrigger>
              <SelectContent>
                {columnNames.map((col) => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Describe what this column must satisfy
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              placeholder='e.g. "Email must never be blank and must be a valid email address"'
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
            />
            <p className="text-[10px] text-slate-400">
              Rules are generated locally in your browser — your data never leaves your machine.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={!aiDescription.trim() || !columnName}
            className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#1E3A5F" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Rules
          </button>

          {aiError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{aiError}</p>
          )}

          {aiResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-600">{aiResults.length} rule{aiResults.length !== 1 ? "s" : ""} generated</p>
              {aiResults.map((rule, i) => {
                const accepted = acceptedRules.has(i);
                return (
                  <div key={i} className={`rounded-lg border px-3 py-3 space-y-1.5 ${accepted ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-800">{rule.rule_type.replace(/_/g, " ")}</span>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 capitalize">{rule.dimension}</span>
                          <span className="inline-flex items-center rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] text-teal-700">{Math.round(rule.confidence * 100)}% confidence</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{rule.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAcceptRule(rule, i)}
                        disabled={accepted}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                          accepted
                            ? "bg-emerald-100 text-emerald-700 cursor-default"
                            : "bg-[#1E3A5F] text-white hover:opacity-90"
                        }`}
                      >
                        {accepted ? "✓ Added" : "Accept"}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Threshold: {Math.round(rule.threshold * 100)}%
                      {Object.keys(rule.parameters).length > 0 && (
                        <> · Params: {JSON.stringify(rule.parameters)}</>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Column */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">Column</label>
        <Select
          value={columnName}
          onValueChange={(v) => setColumnName(v ?? "")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select column…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Dataset-level (no column)</SelectItem>
            {columnNames.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Format Detection Badge */}
      {isDateColumn && dateFormats && dateFormats.length > 0 && (
        <DateFormatBadge formats={dateFormats} hasMixed={hasMixedFormats} />
      )}

      {/* Dimension */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">Dimension</label>
        <Select value={dimension} onValueChange={handleDimensionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select dimension…" />
          </SelectTrigger>
          <SelectContent>
            {DIMENSIONS.map((d) => (
              <SelectItem key={d} value={d}>
                <span className="capitalize">{d}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rule Type */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">Rule Type</label>
        <Select value={ruleType} onValueChange={handleRuleTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select rule type…" />
          </SelectTrigger>
          <SelectContent>
            {availableRuleTypes.map((rt) => (
              <SelectItem key={rt.value} value={rt.value}>
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conflict warning */}
      {conflictingRule && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-snug">
            A <span className="font-semibold">{conflictingRule.rule_type.replace(/_/g, " ")}</span> rule already exists for{" "}
            <span className="font-semibold">{conflictingRule.dimension}</span> on this column. Only one rule type per column–dimension is allowed.
          </p>
        </div>
      )}

      {/* Example Card */}
      {example && (
        <ExampleCard
          example={example}
          columnName={columnName || "this column"}
          onApplyThreshold={(pct) => setThreshold(pct)}
        />
      )}

      {/* Dynamic params */}
      {(() => {
        const COLUMN_PARAMS = new Set(["col_b", "reference_column", "if_column"]);
        return requiredParams.map((param) => (
          <div key={param} className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              {param.replace(/_/g, " ")}
            </label>
            {COLUMN_PARAMS.has(param) ? (
              <Select
                value={paramValues[param] ?? ""}
                onValueChange={(v) => {
                  if (v !== null) setParamValues((prev) => ({ ...prev, [param]: v }));
                }}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select column…" />
                </SelectTrigger>
                <SelectContent>
                  {columnNames
                    .filter((c) => c !== columnName)
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
                value={paramValues[param] ?? ""}
                onChange={(e) =>
                  setParamValues((prev) => ({ ...prev, [param]: e.target.value }))
                }
              />
            )}
          </div>
        ));
      })()}

      {/* Threshold */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600">Threshold</label>
        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              { key: "strict",   value: "99", label: "Strict",   hint: "IDs & keys" },
              { key: "standard", value: "95", label: "Standard", hint: "most rules" },
              { key: "lenient",  value: "80", label: "Lenient",  hint: "optional fields" },
              { key: "custom",   value: null, label: "Custom",   hint: "" },
            ] as const
          ).map(({ key, value, label, hint }) => {
            const isSelected = thresholdMode === key;
            return (
              <button
                key={key}
                type="button"
                title={hint}
                onClick={() => {
                  setThresholdMode(key);
                  if (value) setThreshold(value);
                }}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  isSelected
                    ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {label}{value ? ` ${value}%` : ""}
              </button>
            );
          })}
        </div>
        {thresholdMode === "custom" && (
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="e.g. 90"
          />
        )}
        <p className="text-[11px] text-slate-400">
          {thresholdMode === "strict"   && "Zero-tolerance — use for IDs, keys, and mandatory fields."}
          {thresholdMode === "standard" && "Recommended for most rules. Allows up to 5% exceptions."}
          {thresholdMode === "lenient"  && "Use for optional or enrichment fields with incomplete data."}
          {thresholdMode === "custom"   && `Rule passes if score ≥ ${threshold}%.`}
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600">
          Rule created successfully.
        </p>
      )}

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
        style={{ background: "#1A1A2E" }}
      >
        Add Rule
      </button>
    </form>
      )}
    </div>
  );
}

// ---- Date Format Badge --------------------------------------------------

function ambiguityLabel(a: DetectedDateFormat["ambiguity"]): { text: string; color: string } {
  if (a === "unambiguous") return { text: "unambiguous", color: "text-emerald-600" };
  if (a === "day_first")   return { text: "day-first confirmed", color: "text-emerald-600" };
  if (a === "month_first") return { text: "month-first confirmed", color: "text-emerald-600" };
  return { text: "ambiguous", color: "text-amber-600" };
}

interface DateFormatBadgeProps {
  formats: DetectedDateFormat[];
  hasMixed: boolean;
}

function DateFormatBadge({ formats, hasMixed }: DateFormatBadgeProps) {
  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2.5 space-y-2">
      <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wide">
        Detected Date Formats
      </p>
      <div className="space-y-1.5">
        {formats.map((f) => {
          const { text, color } = ambiguityLabel(f.ambiguity);
          const confPct = Math.round(f.confidence * 100);
          return (
            <div key={f.format} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex items-center rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-teal-800 shrink-0">
                {f.format}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="h-1 flex-1 max-w-[60px] rounded-full bg-teal-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${confPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{f.matchPct}% of values</span>
                  <span className={`text-[10px] font-medium ${color}`}>· {text}</span>
                </div>
                {f.exampleValues.length > 0 && (
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    e.g. {f.exampleValues.join(", ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {hasMixed && (
        <div className="flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2 py-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-700">
            Mixed date formats detected — this is a data quality issue. Consider adding a Format Standardization rule.
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Example Card -------------------------------------------------------

interface ExampleCardProps {
  example: RuleExample;
  columnName: string;
  onApplyThreshold: (pct: string) => void;
}

function ExampleCard({ example, columnName, onApplyThreshold }: ExampleCardProps) {
  const [applied, setApplied] = useState(false);
  const description = example.description.replace(/this column/gi, `"${columnName}"`);

  function handleApply() {
    onApplyThreshold(String(example.recommendedThreshold));
    setApplied(true);
    setTimeout(() => setApplied(false), 1500);
  }

  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2.5 space-y-2.5 text-xs">
      {/* Header */}
      <div className="flex items-start gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-indigo-800 text-[11px]">{example.title}</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">{description}</p>
        </div>
      </div>

      {/* Pass / Fail examples */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold text-green-700 uppercase tracking-wide">Passes ✓</p>
          {example.passingExamples.map((ex, i) => (
            <div key={i} className="flex items-start gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-green-500 shrink-0 mt-0.5" />
              <code className="text-[10px] text-slate-700 leading-snug break-all">{ex}</code>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-semibold text-red-700 uppercase tracking-wide">Fails ✗</p>
          {example.failingExamples.map((ex, i) => (
            <div key={i} className="flex items-start gap-1">
              <X className="w-2.5 h-2.5 text-red-400 shrink-0 mt-0.5" />
              <code className="text-[10px] text-slate-700 leading-snug break-all">{ex}</code>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="rounded-md bg-white border border-indigo-100 px-2 py-1.5">
        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">When to use</p>
        <p className="text-[10px] text-slate-600 leading-relaxed">{example.whenToUse}</p>
      </div>

      {/* Business impact */}
      <div className="rounded-md bg-amber-50 border border-amber-100 px-2 py-1.5">
        <p className="text-[9px] font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Business impact</p>
        <p className="text-[10px] text-amber-800 leading-relaxed">{example.businessImpact}</p>
      </div>

      {/* Recommended threshold */}
      <div className="flex items-center justify-between pt-1 border-t border-indigo-100">
        <span className="text-[10px] text-slate-500">
          Recommended:{" "}
          <span className="font-semibold text-indigo-700">{example.recommendedThreshold}%</span>
        </span>
        <button
          type="button"
          onClick={handleApply}
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium text-white transition-colors ${
            applied ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {applied ? "Applied ✓" : "Apply →"}
        </button>
      </div>
    </div>
  );
}

// ---- Param hints -------------------------------------------------------

function paramHint(param: string): string {
  const hints: Record<string, string> = {
    pattern:           "e.g. ^\\d{4}-\\d{2}-\\d{2}$",
    allowed_values:    "comma-separated: yes,no,maybe",
    expected_type:     "date, numeric, boolean",
    min:               "e.g. 0",
    max:               "e.g. 1000000",
    max_age_days:      "e.g. 30",
    decimals:          "e.g. 2",
    max_decimals:      "e.g. 2",
    case:              "upper, lower, or title",
    reference_column:  "column name in this dataset",
    if_column:         "condition column name",
    if_value:          "condition value",
    col_b:             "column name to compare",
    operator:          ">= , <= , == , > , <",
    template:          "email, phone, date_iso, uuid…",
    pattern2:          "regex pattern for col_b",
  };
  return hints[param] ?? param;
}
