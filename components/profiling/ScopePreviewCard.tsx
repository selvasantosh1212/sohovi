"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useGlobalScopeFilterStore } from "@/store/globalScopeFilterStore";
import { useFileStore } from "@/store/fileStore";
import { getWorkflows } from "@/app/actions/workflows";
import { ScopeConditionEditor } from "@/components/shared/ScopeConditionEditor";
import { ScopeMatchBadge } from "@/components/shared/ScopeMatchBadge";
import { applyScopeFilter } from "@/lib/dq-engine/scope-filter";

interface Props {
  assetId: string;
  columnNames: string[];
}

export function ScopePreviewCard({ assetId, columnNames }: Props) {
  const [open, setOpen] = useState(false);
  const storeAssetId = useGlobalScopeFilterStore((s) => s.assetId);
  const conditions = useGlobalScopeFilterStore((s) => s.conditions);
  const setConditions = useGlobalScopeFilterStore((s) => s.setConditions);
  const applyWorkflowDefault = useGlobalScopeFilterStore((s) => s.applyWorkflowDefault);
  const fileData = useFileStore((s) => s.data);

  // Profile is typically the first page visited after upload, so it must also
  // resolve the workflow default here — otherwise it would claim this asset's
  // slot with empty conditions before the Rules page ever gets a chance to.
  useEffect(() => {
    if (storeAssetId === assetId) return;
    getWorkflows(assetId)
      .then((workflows) => {
        const match = workflows.find((w) => w.is_active && w.default_scope_conditions?.length > 0);
        if (match) {
          applyWorkflowDefault(match.default_scope_conditions, match.name, assetId);
        } else {
          setConditions([], assetId);
        }
      })
      .catch(() => setConditions([], assetId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, storeAssetId]);

  const { matchedRows, totalRows } = useMemo(() => {
    if (!fileData) return { matchedRows: 0, totalRows: 0 };
    if (conditions.length === 0) return { matchedRows: fileData.rows.length, totalRows: fileData.rows.length };
    const inScope = applyScopeFilter(fileData.rows, fileData.headers, conditions);
    return { matchedRows: inScope.length, totalRows: fileData.rows.length };
  }, [fileData, conditions]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">
            Scope Filter Preview{conditions.length > 0 ? ` · ${conditions.length} condition${conditions.length !== 1 ? "s" : ""}` : ""}
          </h2>
        </div>
        <span className="text-slate-400 text-sm">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Profiling stats above always cover the full table. Set a filter here to preview how
            many rows it would match before applying it to a DQ run on the Rules page.
          </p>
          <ScopeConditionEditor
            conditions={conditions}
            onChange={(next) => setConditions(next, assetId)}
            availableColumns={columnNames}
          />
          <ScopeMatchBadge
            matchedRows={matchedRows}
            totalRows={totalRows}
            hasConditions={conditions.length > 0}
          />
        </div>
      )}
    </div>
  );
}
