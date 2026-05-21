/**
 * profilingStore.ts
 *
 * Zustand store for column profiling results.
 * PRIVACY: profiles contain aggregated stats only (no raw values — PII is masked).
 * Never persisted to localStorage or any server.
 */

import { create } from "zustand";
import type { ColumnProfile } from "@/types/profiling.types";

interface ProfilingState {
  profiles: ColumnProfile[] | null;
  assetId: string | null;
  /** Set profiling results (called after profiler worker completes) */
  setProfiles: (profiles: ColumnProfile[], assetId: string) => void;
  /** Clear profiling state */
  clear: () => void;
}

export const useProfilingStore = create<ProfilingState>()((set) => ({
  profiles: null,
  assetId: null,
  setProfiles: (profiles, assetId) => set({ profiles, assetId }),
  clear: () => set({ profiles: null, assetId: null }),
}));
