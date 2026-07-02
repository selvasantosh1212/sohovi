"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { ColumnMappingEditor } from "@/components/workflows/ColumnMappingEditor";
import { applyWorkflowToAsset, type ApplyWorkflowResult } from "@/app/actions/workflows";
import { DIMENSION_COLORS } from "@/lib/dq-engine/dimension-meta";
import type { DataAsset, Workflow, WorkflowRule, DQDimension } from "@/types/app.types";

interface Props {
  workflow: Workflow;
  workflowRules: WorkflowRule[];
  assets: DataAsset[];
}

export function ApplyWorkflowFlow({ workflow, workflowRules, assets }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"asset" | "mapping" | "result">("asset");
  const [targetAssetId, setTargetAssetId] = useState("");
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplyWorkflowResult | null>(null);

  const targetAsset = assets.find((a) => a.id === targetAssetId);
  const targetColumns = useMemo(() => targetAsset?.column_schema ?? [], [targetAsset]);

  const sourceColumns = useMemo(
    () => Array.from(new Set(workflowRules.map((r) => r.column_name).filter((c): c is string => !!c))),
    [workflowRules]
  );

  function handlePickAsset(assetId: string) {
    setTargetAssetId(assetId);
    const asset = assets.find((a) => a.id === assetId);
    const cols = asset?.column_schema ?? [];
    // Pre-fill identity mapping wherever a canonical column name exactly matches a target column.
    const prefill: Record<string, string> = {};
    for (const col of sourceColumns) {
      if (cols.includes(col)) prefill[col] = col;
    }
    setColumnMapping(prefill);
    setStep("mapping");
  }

  async function handleApply() {
    setApplying(true);
    setError(null);
    try {
      const res = await applyWorkflowToAsset({
        workflow_id: workflow.id,
        target_asset_id: targetAssetId,
        column_mapping: columnMapping,
      });
      setResult(res);
      setStep("result");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply workflow.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <span className={step === "asset" ? "text-[#1E3A5F]" : ""}>1. Target asset</span>
        <ArrowRight className="w-3 h-3" />
        <span className={step === "mapping" ? "text-[#1E3A5F]" : ""}>2. Map columns</span>
        <ArrowRight className="w-3 h-3" />
        <span className={step === "result" ? "text-[#1E3A5F]" : ""}>3. Apply</span>
      </div>

      {step === "asset" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Which asset should these rules run on?</h2>
          <p className="text-xs text-slate-400">
            You can apply to the same asset this workflow came from, or to a completely different one.
          </p>
          {assets.length === 0 ? (
            <p className="text-sm text-slate-500">No data assets yet — create one first.</p>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handlePickAsset(asset.id)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-left hover:border-[#1E3A5F] hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{asset.name}</p>
                    {asset.id === workflow.asset_id && (
                      <p className="text-[11px] text-slate-400">Origin asset for this workflow</p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "mapping" && targetAsset && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Map columns for <span className="text-[#1E3A5F]">{targetAsset.name}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Match each rule&apos;s original column to the equivalent column on this asset. Exact name matches are
              pre-filled.
            </p>
            {sourceColumns.length > 0 ? (
              <ColumnMappingEditor
                sourceColumns={sourceColumns}
                targetColumns={targetColumns}
                value={columnMapping}
                onChange={setColumnMapping}
              />
            ) : (
              <p className="text-xs text-slate-400 italic">
                This workflow has no column-scoped rules — nothing to map.
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Preview — {workflowRules.length} rules</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {workflowRules.map((rule) => {
                const resolvedColumn = rule.column_name
                  ? columnMapping[rule.column_name] ?? rule.column_name
                  : null;
                const unresolved =
                  rule.column_name && resolvedColumn && !targetColumns.includes(resolvedColumn);
                return (
                  <div key={rule.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize shrink-0 ${
                        DIMENSION_COLORS[rule.dimension as DQDimension] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {rule.dimension}
                    </span>
                    <span className="text-slate-600 truncate">{rule.rule_type.replace(/_/g, " ")}</span>
                    {rule.column_name && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                        <span
                          className={`font-mono text-xs truncate ${unresolved ? "text-amber-600" : "text-slate-500"}`}
                        >
                          {resolvedColumn}
                        </span>
                        {unresolved && (
                          <span title="No matching column on the target asset — this rule will likely fail every run">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("asset")}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "#00C9A7", color: "#0d1e33" }}
            >
              {applying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {applying ? "Applying…" : `Apply ${workflowRules.length} rules`}
            </button>
          </div>
        </div>
      )}

      {step === "result" && result && targetAsset && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {result.created.length} rule{result.created.length !== 1 ? "s" : ""} created on {targetAsset.name}
              </p>
              {result.skipped.length > 0 && (
                <p className="text-xs text-amber-600 mt-0.5">
                  {result.skipped.length} skipped (see below)
                </p>
              )}
            </div>
          </div>

          {result.skipped.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
              {result.skipped.map((s, i) => (
                <p key={i} className="text-xs text-amber-800">
                  <span className="font-mono">{s.rule.column_name ?? "(no column)"}</span> · {s.rule.rule_type.replace(/_/g, " ")} — {s.reason}
                </p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/assets/${targetAsset.id}/rules`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ background: "#1A1A2E" }}
            >
              View rules on {targetAsset.name}
            </Link>
            <Link
              href={`/dashboard/workflows/${workflow.id}`}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to workflow
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
