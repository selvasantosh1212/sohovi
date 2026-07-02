"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createWorkflow, updateWorkflow, type WorkflowInput } from "@/app/actions/workflows";
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
  const originAssetId = workflow?.asset_id ?? defaultAssetId ?? null;
  const originAsset = assets.find((a) => a.id === originAssetId);
  const [defaultScopeConditions, setDefaultScopeConditions] = useState<ScopeCondition[]>(
    workflow?.default_scope_conditions ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sourceColumns = originAsset?.column_schema ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setError(null);
    setSubmitting(true);

    const input: WorkflowInput = {
      asset_id: originAssetId,
      name: name.trim(),
      description: description.trim() || null,
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
          placeholder="e.g. Customer Master DQ"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
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

      {/* Origin asset — display only; rules are added via "Save as Workflow" on the Rules page */}
      {originAsset && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Originally authored from</label>
          <p className="text-sm text-slate-500">{originAsset.name}</p>
        </div>
      )}

      {/* Default scope filter — only meaningful once we know a column list (i.e. an origin asset) */}
      {originAsset && sourceColumns.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Default Scope Filter</label>
          <p className="text-xs text-slate-400">
            Pre-fills the scope filter on the Profiling page whenever the origin asset is uploaded, and seeds
            scope conditions on rules created when this workflow is applied elsewhere (still editable before applying).
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
