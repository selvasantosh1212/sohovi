/**
 * dqStore.ts
 *
 * In-memory Zustand store for the current DQ run result.
 * NEVER persisted to localStorage — privacy-safe.
 */

import { create } from "zustand";
import type { DQRunResult } from "@/types/dq.types";

interface DQState {
  result: DQRunResult | null;
  assetId: string | null;
  setResult: (result: DQRunResult, assetId: string) => void;
  clear: () => void;
}

export const useDQStore = create<DQState>()((set) => ({
  result: null,
  assetId: null,
  setResult: (result, assetId) => set({ result, assetId }),
  clear: () => set({ result: null, assetId: null }),
}));
