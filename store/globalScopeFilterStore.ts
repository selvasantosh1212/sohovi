/**
 * globalScopeFilterStore.ts
 *
 * Zustand store for the run-wide scope filter — restricts an entire DQ run
 * (all active rules) to a row subset, independent of any rule's own
 * per-rule scope_conditions. Session-only, in-memory — never persisted,
 * same pattern as fileStore/profilingStore.
 */

import { create } from "zustand";
import type { ScopeCondition } from "@/types/dq.types";

interface GlobalScopeFilterState {
  conditions: ScopeCondition[];
  assetId: string | null;
  /** Name of the workflow that pre-populated `conditions`, if any — for UI hinting. */
  sourceWorkflowName: string | null;
  setConditions: (conditions: ScopeCondition[], assetId: string) => void;
  /** Pre-populates from a workflow default, but only if this asset hasn't already been initialized (avoids clobbering an in-progress edit on remount). */
  applyWorkflowDefault: (conditions: ScopeCondition[], workflowName: string, assetId: string) => void;
  clear: () => void;
}

export const useGlobalScopeFilterStore = create<GlobalScopeFilterState>()((set, get) => ({
  conditions: [],
  assetId: null,
  sourceWorkflowName: null,
  setConditions: (conditions, assetId) => set({ conditions, assetId }),
  applyWorkflowDefault: (conditions, workflowName, assetId) => {
    if (get().assetId === assetId) return;
    set({ conditions, assetId, sourceWorkflowName: workflowName });
  },
  clear: () => set({ conditions: [], assetId: null, sourceWorkflowName: null }),
}));
