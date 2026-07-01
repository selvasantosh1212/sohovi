"use client";

import { useState, useCallback } from "react";
import { useFileStore } from "@/store/fileStore";
import { runDQRules } from "@/workers/worker-bridge";
import { createRule } from "@/app/actions/rules";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Play, Save, Upload, BookOpen, CheckCircle, XCircle, X } from "lucide-react";
import Link from "next/link";
import type { DQDimension } from "@/types/app.types";
import type { RuleConfig, RuleResult, ScopeCondition, ScopeOperator } from "@/types/dq.types";
import { getRuleExample } from "@/lib/dq-rule-examples";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FailedRecordsTable } from "@/components/scoring/FailedRecordsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SCOPE_OPERATORS: { value: ScopeOperator; label: string }[] = [
  { value: "==", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: ">=", label: "greater or equal" },
  { value: "<", label: "less than" },
  { value: "<=", label: "less or equal" },
  { value: "in", label: "in (comma-separated)" },
  { value: "contains", label: "contains" },
];

const DIMENSIONS: DQDimension[] = [
  "completeness", "validity", "accuracy", "uniqueness",
  "consistency", "integrity", "timeliness", "currency",
  "conformity", "precision",
];

const RULE_TYPES: Record<DQDimension, { value: string; label: string; params?: string[] }[]> = {
  completeness: [
    { value: "not_null", label: "Not Null" },
    { value: "not_empty", label: "Not Empty" },
    { value: "mandatory_column", label: "Mandatory Column" },
    { value: "conditional_not_null", label: "Conditional Not Null", params: ["if_column", "if_value"] },
  ],
  validity: [
    { value: "regex_match", label: "Regex Match", params: ["pattern"] },
    { value: "enum_validation", label: "Enum Validation", params: ["allowed_values"] },
    { value: "datatype_check", label: "Datatype Check", params: ["expected_type"] },
  ],
  accuracy: [
    { value: "range_check", label: "Range Check", params: ["min", "max"] },
    { value: "positive_check", label: "Positive Check" },
    { value: "cross_field_comparison", label: "Cross-Field Compare", params: ["reference_column", "operator"] },
  ],
  uniqueness: [
    { value: "unique_column", label: "Unique Column" },
    { value: "duplicate_detection", label: "Duplicate Detection" },
  ],
  consistency: [
    { value: "format_standardization", label: "Format Standardization" },
    { value: "case_consistency", label: "Case Consistency", params: ["case"] },
  ],
  integrity: [
    { value: "referential_integrity", label: "Referential Integrity", params: ["reference_column"] },
  ],
  timeliness: [
    { value: "freshness_check", label: "Freshness Check", params: ["max_age_days"] },
    { value: "not_future_date", label: "Not Future Date" },
  ],
  currency: [
    { value: "recent_update", label: "Recent Update", params: ["max_age_days"] },
    { value: "not_stale", label: "Not Stale", params: ["max_age_days"] },
  ],
  conformity: [
    { value: "format_check", label: "Format Check", params: ["template"] },
    { value: "datatype_enforcement", label: "Datatype Enforcement", params: ["expected_type"] },
  ],
  precision: [
    { value: "decimal_places", label: "Decimal Places", params: ["max_decimals"] },
    { value: "rounding_check", label: "Rounding Check", params: ["decimals"] },
  ],
};

interface Props {
  assetId: string;
  assetName: string;
  columnSchema: string[];
}

function paramHint(param: string): string {
  const hints: Record<string, string> = {
    pattern: "e.g. ^\\d{4}-\\d{2}-\\d{2}$",
    allowed_values: "comma-separated: yes,no,maybe",
    expected_type: "date, numeric, boolean",
    min: "e.g. 0",
    max: "e.g. 1000000",
    max_age_days: "e.g. 30",
    decimals: "e.g. 2",
    max_decimals: "e.g. 2",
    case: "upper, lower, or title",
    reference_column: "column name",
    if_column: "condition column",
    if_value: "condition value",
    operator: ">= <= == > <",
    template: "email, phone, date_iso, uuid",
  };
  return hints[param] ?? param;
}

export function SandboxClient({ assetId, assetName, columnSchema }: Props) {
  const fileData = useFileStore((s) => s.data);

  const [dimension, setDimension] = useState<DQDimension>("completeness");
  const [ruleType, setRuleType] = useState("not_null");
  const [columnName, setColumnName] = useState(columnSchema[0] ?? "");
  const [threshold, setThreshold] = useState("95");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RuleResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [scopeConditions, setScopeConditions] = useState<ScopeCondition[]>([]);
  const [showFailures, setShowFailures] = useState(false);

  const columns = fileData?.headers ?? columnSchema;

  const availableRuleTypes = RULE_TYPES[dimension] ?? [];
  const selectedRuleType = availableRuleTypes.find((r) => r.value === ruleType);
  const requiredParams = selectedRuleType?.params ?? [];

  function handleDimensionChange(val: string | null) {
    const d = (val ?? "completeness") as DQDimension;
    setDimension(d);
    setRuleType(RULE_TYPES[d]?.[0]?.value ?? "");
    setParamValues({});
    setScopeConditions([]);
    setResult(null);
  }

  const handleRun = useCallback(async () => {
    if (!fileData) return;

    const thresholdNum = parseFloat(threshold) / 100;
    if (isNaN(thresholdNum)) { toast.error("Invalid threshold"); return; }

    // Build parameters
    const parameters: Record<string, unknown> = {};
    for (const param of requiredParams) {
      const raw = paramValues[param] ?? "";
      if (!raw.trim()) { toast.error(`Parameter "${param}" is required`); return; }
      const num = Number(raw);
      if (!isNaN(num) && raw.trim() !== "") {
        parameters[param] = num;
      } else if (param === "allowed_values") {
        parameters[param] = raw.split(",").map((v) => v.trim());
      } else {
        parameters[param] = raw;
      }
    }

    const rule: RuleConfig = {
      id: "__sandbox__",
      column_name: columnName || null,
      description: description.trim() || null,
      dimension,
      rule_type: ruleType,
      parameters,
      scope_conditions: scopeConditions,
      threshold: thresholdNum,
      weight: 1,
      is_active: true,
    };

    setRunning(true);
    setResult(null);
    try {
      const runResult = await runDQRules(
        fileData.headers,
        fileData.rows,
        [rule],
        assetId
      );
      setResult(runResult.rule_results[0] ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }, [fileData, dimension, ruleType, columnName, threshold, paramValues, requiredParams, scopeConditions, description, assetId]);

  async function handleSaveRule() {
    const thresholdNum = parseFloat(threshold) / 100;
    const parameters: Record<string, unknown> = {};
    for (const param of requiredParams) {
      const raw = paramValues[param] ?? "";
      const num = Number(raw);
      if (!isNaN(num) && raw.trim() !== "") {
        parameters[param] = num;
      } else if (param === "allowed_values") {
        parameters[param] = raw.split(",").map((v) => v.trim());
      } else {
        parameters[param] = raw;
      }
    }
    setSaving(true);
    try {
      await createRule({
        asset_id: assetId,
        column_name: columnName || null,
        description: description.trim() || null,
        dimension,
        rule_type: ruleType,
        parameters,
        scope_conditions: scopeConditions,
        threshold: thresholdNum,
      });
      toast.success("Rule saved to asset");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!fileData) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
        <Upload className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-medium">No file in memory</p>
        <p className="text-sm text-slate-400">
          Upload a file first — the sandbox tests rules against your in-memory data.
        </p>
        <Link
          href={`/dashboard/assets/${assetId}/upload`}
          className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[#1E3A5F] hover:underline"
        >
          Upload file →
        </Link>
      </div>
    );
  }

  const example = getRuleExample(dimension, ruleType);

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rule config panel */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm">Configure Rule</h2>

        {/* Column */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Column</label>
          <Select value={columnName} onValueChange={(v) => { setColumnName(v ?? ""); setResult(null); }}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Dataset-level</SelectItem>
              {columns.map((col) => <SelectItem key={col} value={col}>{col}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Dimension */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Dimension</label>
          <Select value={dimension} onValueChange={handleDimensionChange}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIMENSIONS.map((d) => <SelectItem key={d} value={d}><span className="capitalize">{d}</span></SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Rule Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Rule Type</label>
          <Select value={ruleType} onValueChange={(v) => { setRuleType(v ?? ""); setParamValues({}); setResult(null); }}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {availableRuleTypes.map((rt) => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic params */}
        {requiredParams.map((param) => (
          <div key={param} className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">{param.replace(/_/g, " ")}</label>
            <input
              type="text"
              placeholder={paramHint(param)}
              value={paramValues[param] ?? ""}
              onChange={(e) => { setParamValues((p) => ({ ...p, [param]: e.target.value })); setResult(null); }}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        ))}

        {/* Threshold */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Threshold (%)</label>
          <input
            type="number" min={0} max={100} step={1}
            value={threshold}
            onChange={(e) => { setThreshold(e.target.value); setResult(null); }}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">Description (optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setResult(null); }}
            placeholder="Notes about why this rule exists or what it checks…"
            className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
          />
        </div>

        {/* Scope (optional) */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setScopeOpen((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            <span>
              Scope (optional){scopeConditions.length > 0 ? ` · ${scopeConditions.length} condition${scopeConditions.length !== 1 ? "s" : ""}` : ""}
            </span>
            <span className="text-slate-400">{scopeOpen ? "−" : "+"}</span>
          </button>
          {scopeOpen && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <p className="text-[11px] text-slate-500">
                Only evaluate rows matching all conditions below (e.g. status == Approved).
              </p>
              {scopeConditions.map((cond, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Select
                    value={cond.column}
                    onValueChange={(v) =>
                      setScopeConditions((prev) =>
                        prev.map((c, idx) => (idx === i ? { ...c, column: v ?? "" } : c))
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Column…" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={cond.operator}
                    onValueChange={(v) =>
                      setScopeConditions((prev) =>
                        prev.map((c, idx) => (idx === i ? { ...c, operator: (v ?? "==") as ScopeOperator } : c))
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-[88px] shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCOPE_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="text"
                    className="flex h-8 w-24 rounded-lg border border-input bg-transparent px-2 py-1 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="Value"
                    value={cond.value}
                    onChange={(e) =>
                      setScopeConditions((prev) =>
                        prev.map((c, idx) => (idx === i ? { ...c, value: e.target.value } : c))
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setScopeConditions((prev) => prev.filter((_, idx) => idx !== i))}
                    className="shrink-0 text-slate-400 hover:text-red-500"
                    aria-label="Remove condition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setScopeConditions((prev) => [
                    ...prev,
                    { column: columns[0] ?? "", operator: "==", value: "" },
                  ])
                }
                className="text-[11px] font-medium text-[#1E3A5F] hover:underline"
              >
                + Add condition
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: "#1E3A5F" }}
          >
            <Play className="w-3.5 h-3.5" />
            {running ? "Running…" : "Run Test"}
          </button>
          {result && (
            <button
              onClick={handleSaveRule}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E3A5F] px-3 py-2 text-sm font-semibold text-[#1E3A5F] hover:bg-[#1E3A5F]/5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Save Rule"}
            </button>
          )}
        </div>
      </div>

      {/* Result panel */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm">Result</h2>

        {!result && !running && (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Configure a rule and click Run Test
          </div>
        )}

        {running && (
          <div className="h-48 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Evaluating rule…</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Score */}
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0`}
                style={{
                  background:
                    result.score >= 0.95 ? "#10B981" :
                    result.score >= 0.80 ? "#00C9A7" :
                    result.score >= 0.60 ? "#F59E0B" : "#EF4444",
                }}
              >
                {Math.round(result.score * 100)}
              </div>
              <div>
                <StatusBadge
                  status={result.status}
                  className="text-sm px-2.5 py-1"
                  onClick={
                    result.failed_indices.length > 0
                      ? () => setShowFailures(true)
                      : undefined
                  }
                />
                {result.description && (
                  <p className="text-sm text-slate-700 mt-1">{result.description}</p>
                )}
                <p className="text-sm text-slate-500 mt-1">{result.message}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total rows", value: result.total_records.toLocaleString() },
                { label: "Failed rows", value: result.failed_records.toLocaleString() },
                { label: "Severity", value: result.severity },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5 text-center">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{value}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>

    {/* Failed records popup */}
    <Dialog open={showFailures} onOpenChange={setShowFailures}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Failed Records</DialogTitle>
        </DialogHeader>
        {result && fileData && (
          <FailedRecordsTable
            ruleResults={[result]}
            headers={fileData.headers}
            rows={fileData.rows}
          />
        )}
      </DialogContent>
    </Dialog>

    {/* Rule Examples Panel */}
    {example && (
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800 text-sm">
            Rule Guide — {example.title}
          </h2>
        </div>

        <p className="text-sm text-slate-600">{example.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Passing Examples
            </p>
            <ul className="space-y-1">
              {example.passingExamples.map((ex, i) => (
                <li key={i} className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-100">
                  {ex}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Failing Examples
            </p>
            <ul className="space-y-1">
              {example.failingExamples.map((ex, i) => (
                <li key={i} className="text-xs font-mono bg-red-50 text-red-800 px-2.5 py-1 rounded-md border border-red-100">
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-500 mb-1">Business Impact</p>
            <p className="text-xs text-slate-600">{example.businessImpact}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-500 mb-1">When to Use</p>
            <p className="text-xs text-slate-600">{example.whenToUse}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            Recommended threshold: <span className="font-semibold text-slate-700">{example.recommendedThreshold}%</span>
          </p>
          <button
            type="button"
            onClick={() => setThreshold(String(example.recommendedThreshold))}
            className="text-xs font-medium text-[#1E3A5F] hover:underline"
          >
            Apply threshold →
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
