"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWorkflows, promoteRulesToWorkflow } from "@/app/actions/workflows";
import type { Workflow } from "@/types/app.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleIds: string[];
  sourceAssetId: string;
  onSaved?: () => void;
}

export function SaveAsWorkflowDialog({ open, onOpenChange, ruleIds, sourceAssetId, onSaved }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [existingWorkflowId, setExistingWorkflowId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoadingWorkflows(true);
    getWorkflows()
      .then(setWorkflows)
      .catch(() => setWorkflows([]))
      .finally(() => setLoadingWorkflows(false));
  }, [open]);

  async function handleSubmit() {
    setError(null);
    if (mode === "new" && !name.trim()) {
      setError("Name the workflow.");
      return;
    }
    if (mode === "existing" && !existingWorkflowId) {
      setError("Pick a workflow to add these rules to.");
      return;
    }
    setSubmitting(true);
    try {
      const workflow = await promoteRulesToWorkflow({
        rule_ids: ruleIds,
        source_asset_id: sourceAssetId,
        ...(mode === "new"
          ? { new_workflow: { name: name.trim(), description: description.trim() || null } }
          : { workflow_id: existingWorkflowId }),
      });
      toast.success(`Saved ${ruleIds.length} rule${ruleIds.length !== 1 ? "s" : ""} to "${workflow.name}"`);
      onOpenChange(false);
      setName("");
      setDescription("");
      setExistingWorkflowId("");
      onSaved?.();
      router.push(`/dashboard/workflows/${workflow.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save workflow.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Workflow</DialogTitle>
          <DialogDescription>
            Turn {ruleIds.length} selected rule{ruleIds.length !== 1 ? "s" : ""} into a reusable rule template
            you can apply to any other data asset.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                mode === "new"
                  ? "border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#1E3A5F]"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Create new workflow
            </button>
            <button
              type="button"
              onClick={() => setMode("existing")}
              disabled={workflows.length === 0}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                mode === "existing"
                  ? "border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#1E3A5F]"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Add to existing
            </button>
          </div>

          {mode === "new" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer Master DQ"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </div>
          ) : loadingWorkflows ? (
            <p className="text-xs text-slate-400">Loading workflows…</p>
          ) : (
            <Select value={existingWorkflowId} onValueChange={(v) => setExistingWorkflowId(v ?? "")}>
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue placeholder="Choose a workflow…" />
              </SelectTrigger>
              <SelectContent>
                {workflows.map((wf) => (
                  <SelectItem key={wf.id} value={wf.id}>
                    {wf.name} {wf.rule_count ? `(${wf.rule_count} rules)` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: "#1A1A2E" }}
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
