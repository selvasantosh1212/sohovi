/**
 * dqStore.ts
 *
 * In-memory Zustand store for the current DQ run result.
 * NEVER persisted to localStorage — privacy-safe.
 */

import { create } from "zustand";
import type { DQRunResult, ScopeCondition } from "@/types/dq.types";

interface DQState {
  result: DQRunResult | null;
  assetId: string | null;
  /** The global scope filter that was applied to produce `result`, carried through to the scoring page for save-to-history. */
  scopeConditions: ScopeCondition[];
  setResult: (result: DQRunResult, assetId: string, scopeConditions?: ScopeCondition[]) => void;
  clear: () => void;
}

export const useDQStore = create<DQState>()((set) => ({
  result: null,
  assetId: null,
  scopeConditions: [],
  setResult: (result, assetId, scopeConditions = []) => set({ result, assetId, scopeConditions }),
  clear: () => set({ result: null, assetId: null, scopeConditions: [] }),
}));
