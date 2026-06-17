import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Play, Wand2, AlertTriangle } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRules } from "@/app/actions/rules";
import { DimensionGroupAccordion } from "@/components/rules/DimensionGroupAccordion";
import { RuleSuggestionsPanel } from "@/components/rules/RuleSuggestionsPanel";
import { PlanGate } from "@/components/shared/PlanGate";
import { RuleBuilderPanel } from "@/components/rules/RuleBuilderPanel";
import { RunDQButton } from "@/components/rules/RunDQButton";
import { DataPreviewTable } from "@/components/rules/DataPreviewTable";
import { QuickSetupCard } from "@/components/rules/QuickSetupCard";
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
  const [asset, rules] = await Promise.all([getAsset(assetId), getRules(assetId)]);

  if (!asset) notFound();

  const columnNames = asset.column_schema ?? [];

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
  const hasFewRules = rules.filter((r: DQRule) => r.is_active).length < 3;

  return (
    <div className="space-y-6 max-w-6xl">
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

      {/* Smart Start card — shown when profiling data exists and rules are sparse */}
      <QuickSetupCard
        assetId={assetId}
        existingRuleKeys={existingRuleKeys}
        hasFewRules={hasFewRules}
      />

      {/* Data preview table */}
      <DataPreviewTable
        assetId={assetId}
        columnNames={columnNames}
        existingRuleKeys={Array.from(existingRuleKeys)}
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

        {/* Right: add rule + suggestions (1/3 width) */}
        <div className="space-y-6">
          {/* Rule Builder — shown first for quick access */}
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

          {/* AI Rule Identifier */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-slate-700">AI Rule Identifier</h2>
            </div>
            <PlanGate
              minPlan="pro"
              feature="AI Rule Suggestions"
              description="AI-powered rule suggestions are available on the Pro plan. Upgrade to get suggested rules based on your column profiles."
            >
              <RuleSuggestionsPanel
                assetId={assetId}
                existingRuleKeys={existingRuleKeys}
              />
            </PlanGate>
          </div>
        </div>
      </div>

      {/* Sticky action bar — stays visible while scrolling through rules */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-white/90 backdrop-blur-sm border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {rules.filter((r: DQRule) => r.is_active).length} active rule
          {rules.filter((r: DQRule) => r.is_active).length !== 1 ? "s" : ""} ready to run
        </p>
        <RunDQButton assetId={assetId} rules={rules} />
      </div>
    </div>
  );
}
