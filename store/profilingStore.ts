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
  /** Fill-rate threshold (0-100) used to flag "Mandatory Field" pass/fail.
   *  User-adjustable, defaults to 95. Session-only — not persisted, and not
   *  reset by clear() so it survives re-uploads within the same session. */
  mandatoryFieldThreshold: number;
  setMandatoryFieldThreshold: (pct: number) => void;
}

export const useProfilingStore = create<ProfilingState>()((set) => ({
  profiles: null,
  assetId: null,
  setProfiles: (profiles, assetId) => set({ profiles, assetId }),
  clear: () => set({ profiles: null, assetId: null }),
  mandatoryFieldThreshold: 95,
  setMandatoryFieldThreshold: (pct) => set({ mandatoryFieldThreshold: pct }),
}));
