"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Loader2 } from "lucide-react";
import { useFileStore } from "@/store/fileStore";
import { useProfilingStore } from "@/store/profilingStore";
import { getWorkflows } from "@/app/actions/workflows";
import { ScopeConditionEditor } from "@/components/shared/ScopeConditionEditor";
import { ScopeMatchBadge } from "@/components/shared/ScopeMatchBadge";
import { applyScopeFilter } from "@/lib/dq-engine/scope-filter";
import { profileData } from "@/workers/worker-bridge";
import type { ScopeCondition } from "@/types/dq.types";

interface Props {
  assetId: string;
  columnNames: string[];
}

export function ScopePreviewCard({ assetId, columnNames }: Props) {
  const [open, setOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const fileData = useFileStore((s) => s.data);
  const appliedScopeConditions = useFileStore((s) => s.appliedScopeConditions);
  const applyScopeFilterToStore = useFileStore((s) => s.applyScopeFilter);
  const setProfiles = useProfilingStore((s) => s.setProfiles);

  // Editable draft, seeded from whatever filter is already in effect for this
  // asset so re-opening the panel (or navigating back to this page) reflects
  // reality instead of starting blank.
  const [conditions, setConditionsLocal] = useState<ScopeCondition[]>(appliedScopeConditions);

  // Guards for the workflow-default prefill effect below: `touchedByUserRef`
  // prevents a late-resolving getWorkflows() call from clobbering conditions
  // the user already started editing; `resolvedForAssetRef` ensures we only
  // attempt the lookup once per asset.
  const touchedByUserRef = useRef(false);
  const resolvedForAssetRef = useRef<string | null>(null);

  useEffect(() => {
    if (resolvedForAssetRef.current === assetId) return;
    resolvedForAssetRef.current = assetId;

    if (appliedScopeConditions.length > 0) return; // a filter is already in effect — don't touch it

    let cancelled = false;
    getWorkflows(assetId)
      .then((workflows) => {
        if (cancelled || touchedByUserRef.current) return;
        const match = workflows.find((w) => w.is_active && w.default_scope_conditions?.length > 0);
        if (match) setConditionsLocal(match.default_scope_conditions);
      })
      .catch(() => {
        // non-critical — leave conditions as-is
      });

    return () => {
      cancelled = true;
    };
  }, [assetId, appliedScopeConditions]);

  const { matchedRows, totalRows } = useMemo(() => {
    if (!fileData) return { matchedRows: 0, totalRows: 0 };
    if (conditions.length === 0) return { matchedRows: fileData.rows.length, totalRows: fileData.rows.length };
    const inScope = applyScopeFilter(fileData.rows, fileData.headers, conditions);
    return { matchedRows: inScope.length, totalRows: fileData.rows.length };
  }, [fileData, conditions]);

  async function handleApply() {
    if (!fileData || conditions.length === 0 || matchedRows === 0) return;
    setIsApplying(true);
    setApplyError(null);
    try {
      const indices = applyScopeFilter(fileData.rows, fileData.headers, conditions);
      const filteredRows = indices.map((i) => fileData.rows[i]);
      const profiles = await profileData(fileData.headers, filteredRows);
      applyScopeFilterToStore(filteredRows, conditions);
      setProfiles(profiles, assetId);
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsApplying(false);
    }
  }

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
            Scope Filter{conditions.length > 0 ? ` · ${conditions.length} condition${conditions.length !== 1 ? "s" : ""}` : ""}
          </h2>
        </div>
        <span className="text-slate-400 text-sm">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Filters the working dataset down to matching rows, then re-profiles just that subset.
            The filtered data carries forward automatically to the Rules page and any DQ run —
            re-upload the file to start over with the full data.
          </p>
          <ScopeConditionEditor
            conditions={conditions}
            onChange={(next) => {
              touchedByUserRef.current = true;
              setApplyError(null);
              setConditionsLocal(next);
            }}
            availableColumns={columnNames}
          />
          <div className="flex items-center justify-between gap-3">
            <ScopeMatchBadge
              matchedRows={matchedRows}
              totalRows={totalRows}
              hasConditions={conditions.length > 0}
            />
            {conditions.length > 0 && (
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying || matchedRows === 0}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isApplying && <Loader2 className="w-3 h-3 animate-spin" />}
                {isApplying ? "Re-profiling…" : "Apply & Re-Profile"}
              </button>
            )}
          </div>
          {applyError && <p className="text-xs text-red-500">{applyError}</p>}
        </div>
      )}
    </div>
  );
}
