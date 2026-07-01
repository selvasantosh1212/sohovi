import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Play, AlertTriangle } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRules } from "@/app/actions/rules";
import { getWorkflows } from "@/app/actions/workflows";
import { DimensionGroupAccordion } from "@/components/rules/DimensionGroupAccordion";
import { RuleBuilderPanel } from "@/components/rules/RuleBuilderPanel";
import { RunDQButton } from "@/components/rules/RunDQButton";
import { DataPreviewTable } from "@/components/rules/DataPreviewTable";
import { GlobalScopeFilterPanel } from "@/components/rules/GlobalScopeFilterPanel";
import type { DQRule } from "@/types/app.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Rules — ${asset?.name ?? "Asset"}` };
}

export default async function RulesPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, rules, workflows] = await Promise.all([
    getAsset(assetId),
    getRules(assetId),
    getWorkflows(assetId),
  ]);

  if (!asset) notFound();

  const columnNames = asset.column_schema ?? [];
  const defaultScopeWorkflow = workflows.find(
    (w) => w.is_active && w.default_scope_conditions?.length > 0
  );

  // Build existing rule key set for deduplication in suggestions panel
  const existingRuleKeys = new Set<string>(
    rules.map((r: DQRule) => `${r.column_name}|${r.dimension}|${r.rule_type}`)
  );

  // Detect rules whose target column no longer exists in the current file
  const orphanedRules = rules.filter(
    (r: DQRule) => r.column_name && columnNames.length > 0 && !columnNames.includes(r.column_name)
  );
  const orphanedRuleIds = orphanedRules.map((r: DQRule) => r.id);
  const orphanedColumns = [...new Set(orphanedRules.map((r: DQRule) => r.column_name as string))];

  return (
    <div className="space-y-6 max-w-7xl 2xl:max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/assets/${assetId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {asset.name}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">DQ Rules</h1>
          <p className="text-sm text-slate-500 mt-1">
            {rules.length} rule{rules.length !== 1 ? "s" : ""} ·{" "}
            {rules.filter((r: DQRule) => r.is_active).length} active
          </p>
        </div>
      </div>

      {/* Data preview table */}
      <DataPreviewTable
        assetId={assetId}
        columnNames={columnNames}
        rules={rules}
        existingRuleKeys={Array.from(existingRuleKeys)}
      />

      {/* Global scope filter — restricts the entire DQ run below, leaves profiling unaffected */}
      <GlobalScopeFilterPanel
        assetId={assetId}
        columnNames={columnNames}
        defaultScopeConditions={defaultScopeWorkflow?.default_scope_conditions}
        defaultScopeSourceName={defaultScopeWorkflow?.name}
      />

      {/* Main two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: existing rules (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Active Rules</h2>
          </div>

          {orphanedRuleIds.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {orphanedRuleIds.length === 1
                    ? "1 rule references a missing column"
                    : `${orphanedRuleIds.length} rules reference missing columns`}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  <span className="font-mono">{orphanedColumns.join(", ")}</span>
                  {" "}no longer exist in this file. These rules will always fail — delete them or re-upload a file that includes these columns.
                </p>
              </div>
            </div>
          )}

          <DimensionGroupAccordion rules={rules} assetId={assetId} orphanedRuleIds={orphanedRuleIds} columnNames={columnNames} />
        </div>

        {/* Right: add rule (1/3 width). AI suggestions live inline in the
            Data Preview table above (click a column → AI Suggestions) —
            no separate copy of that panel here. */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Add Custom Rule</h2>
            </div>
            {columnNames.length === 0 ? (
              <p className="text-xs text-slate-400">
                Upload a file first to populate the column list.
              </p>
            ) : (
              <RuleBuilderPanel assetId={assetId} columnNames={columnNames} existingRules={rules} />
            )}
          </div>
        </div>
      </div>

      {/* Floating action bar — stays visible while scrolling through rules */}
      <div className="sticky bottom-4 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {rules.filter((r: DQRule) => r.is_active).length} active rule
          {rules.filter((r: DQRule) => r.is_active).length !== 1 ? "s" : ""} ready to run
        </p>
        <RunDQButton assetId={assetId} rules={rules} />
      </div>
    </div>
  );
}
