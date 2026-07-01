"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useGlobalScopeFilterStore } from "@/store/globalScopeFilterStore";
import { useFileStore } from "@/store/fileStore";
import { ScopeConditionEditor } from "@/components/shared/ScopeConditionEditor";
import { ScopeMatchBadge } from "@/components/shared/ScopeMatchBadge";
import { applyScopeFilter } from "@/lib/dq-engine/scope-filter";
import type { ScopeCondition } from "@/types/dq.types";

interface Props {
  assetId: string;
  columnNames: string[];
  defaultScopeConditions?: ScopeCondition[];
  defaultScopeSourceName?: string | null;
}

export function GlobalScopeFilterPanel({
  assetId,
  columnNames,
  defaultScopeConditions,
  defaultScopeSourceName,
}: Props) {
  // Collapsed by default unless a workflow already pre-fills conditions —
  // keeps the page from front-loading two open panels before the rule list.
  const [open, setOpen] = useState(() => (defaultScopeConditions?.length ?? 0) > 0);
  const storeAssetId = useGlobalScopeFilterStore((s) => s.assetId);
  const conditions = useGlobalScopeFilterStore((s) => s.conditions);
  const sourceWorkflowName = useGlobalScopeFilterStore((s) => s.sourceWorkflowName);
  const setConditions = useGlobalScopeFilterStore((s) => s.setConditions);
  const applyWorkflowDefault = useGlobalScopeFilterStore((s) => s.applyWorkflowDefault);
  const fileData = useFileStore((s) => s.data);

  useEffect(() => {
    if (storeAssetId === assetId) return;
    if (defaultScopeConditions && defaultScopeConditions.length > 0) {
      applyWorkflowDefault(defaultScopeConditions, defaultScopeSourceName ?? "workflow", assetId);
    } else {
      setConditions([], assetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, storeAssetId]);

  const { matchedRows, totalRows } = useMemo(() => {
    if (!fileData) return { matchedRows: 0, totalRows: 0 };
    if (conditions.length === 0) return { matchedRows: fileData.rows.length, totalRows: fileData.rows.length };
    const inScope = applyScopeFilter(fileData.rows, fileData.headers, conditions);
    return { matchedRows: inScope.length, totalRows: fileData.rows.length };
  }, [fileData, conditions]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">
            Global Scope Filter{conditions.length > 0 ? ` · ${conditions.length} condition${conditions.length !== 1 ? "s" : ""}` : ""}
          </h2>
        </div>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Restricts the entire DQ run below to rows matching these conditions — profiling stays
            unaffected and always covers the full table.
          </p>
          {sourceWorkflowName && (
            <p className="text-[11px] text-teal-700 bg-teal-50 rounded-md px-2.5 py-1.5">
              Pre-filled from workflow: <span className="font-medium">{sourceWorkflowName}</span>
            </p>
          )}
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
