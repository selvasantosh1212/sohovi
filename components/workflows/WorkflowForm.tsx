"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createWorkflow, updateWorkflow, type WorkflowInput } from "@/app/actions/workflows";
import { ColumnMappingEditor } from "./ColumnMappingEditor";
import { ScopeConditionEditor } from "@/components/shared/ScopeConditionEditor";
import type { Workflow, DataAsset } from "@/types/app.types";
import type { ScopeCondition } from "@/types/dq.types";

interface Props {
  assets: DataAsset[];
  workflow?: Workflow; // if editing
  defaultAssetId?: string;
}

export function WorkflowForm({ assets, workflow, defaultAssetId }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [name, setName] = useState(workflow?.name ?? "");
  const [description, setDescription] = useState(workflow?.description ?? "");
  const [assetId, setAssetId] = useState(workflow?.asset_id ?? defaultAssetId ?? assets[0]?.id ?? "");
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    workflow?.column_mappings ?? {}
  );
  const [defaultScopeConditions, setDefaultScopeConditions] = useState<ScopeCondition[]>(
    workflow?.default_scope_conditions ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedAsset = assets.find((a) => a.id === assetId);
  const sourceColumns = selectedAsset?.column_schema ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    if (!assetId) { setError("Select a data asset."); return; }
    setError(null);
    setSubmitting(true);

    const input: WorkflowInput = {
      asset_id: assetId,
      name: name.trim(),
      description: description.trim() || null,
      column_mappings: columnMappings,
      default_scope_conditions: defaultScopeConditions,
    };

    startTransition(async () => {
      try {
        if (workflow) {
          await updateWorkflow(workflow.id, input);
          router.push(`/dashboard/workflows/${workflow.id}`);
        } else {
          const wf = await createWorkflow(input);
          router.push(`/dashboard/workflows/${wf.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save workflow.");
        setSubmitting(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Workflow Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Monthly Sales Data Check"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* Asset */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Data Asset *</label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
        >
          <option value="">Select asset…</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this workflow check for?"
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
        />
      </div>

      {/* Column mappings */}
      {assetId && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Column Mappings</label>
          <p className="text-xs text-slate-400">
            Map source column names to canonical names so rules apply across file variants.
          </p>
          <ColumnMappingEditor
            sourceColumns={sourceColumns}
            value={columnMappings}
            onChange={setColumnMappings}
          />
        </div>
      )}

      {/* Default scope filter */}
      {assetId && sourceColumns.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Default Scope Filter</label>
          <p className="text-xs text-slate-400">
            Pre-fills the global scope filter whenever this workflow&apos;s asset is run through DQ checks (still editable per run).
          </p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
            <ScopeConditionEditor
              conditions={defaultScopeConditions}
              onChange={setDefaultScopeConditions}
              availableColumns={sourceColumns}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          {submitting ? "Saving…" : workflow ? "Update Workflow" : "Create Workflow"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
