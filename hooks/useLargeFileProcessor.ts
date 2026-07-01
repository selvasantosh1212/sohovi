"use client";

import { useState, useCallback } from "react";
import { processBulkFile } from "@/workers/worker-bridge";
import type { BulkProgress } from "@/workers/worker-bridge";
import { useFileStore } from "@/store/fileStore";
import { useProfilingStore } from "@/store/profilingStore";
import { useGlobalScopeFilterStore } from "@/store/globalScopeFilterStore";

export type BulkPhase = "idle" | "splitting" | "profiling" | "merging" | "done" | "error";

export interface LargeFileProcessorState {
  phase: BulkPhase;
  /** Current chunk being processed (1-based for display) */
  currentChunk: number;
  /** Total chunks — 0 = unknown (CSV streaming) */
  totalChunks: number;
  /** Current column name being profiled within the active chunk */
  currentColumn: string | null;
  /** Column progress within the active chunk (0–100) */
  columnProgress: number;
  /** Overall progress estimate (0–100) */
  overallProgress: number;
  totalRows: number;
  error: string | null;
}

const INITIAL: LargeFileProcessorState = {
  phase: "idle",
  currentChunk: 0,
  totalChunks: 0,
  currentColumn: null,
  columnProgress: 0,
  overallProgress: 0,
  totalRows: 0,
  error: null,
};

export function useLargeFileProcessor() {
  const [state, setState] = useState<LargeFileProcessorState>(INITIAL);

  const setData = useFileStore((s) => s.setData);
  const clearData = useFileStore((s) => s.clear);
  const setProfiles = useProfilingStore((s) => s.setProfiles);
  const clearProfiles = useProfilingStore((s) => s.clear);
  const clearGlobalScope = useGlobalScopeFilterStore((s) => s.clear);

  const start = useCallback(
    async (file: File, assetId: string) => {
      clearData();
      clearProfiles();
      clearGlobalScope();

      setState({
        ...INITIAL,
        phase: "splitting",
        currentChunk: 1,
      });

      try {
        const result = await processBulkFile(file, (p: BulkProgress) => {
          setState((prev) => {
            const chunkDisplay = p.chunkIndex + 1;
            const total = p.totalChunks > 0 ? p.totalChunks : prev.totalChunks;

            // Overall progress estimate:
            //   splitting phase counts as 10% per chunk up to 50%,
            //   profiling phase fills the remaining 50–95%,
            //   merging is 95–100%
            let overallProgress = prev.overallProgress;
            if (p.phase === "splitting") {
              overallProgress = total > 0 ? Math.min(40, Math.round((chunkDisplay / total) * 40)) : prev.overallProgress;
            } else if (p.phase === "profiling") {
              const chunkBase = total > 0 ? (p.chunkIndex / total) * 50 : 0;
              const colPct =
                p.totalColumns && p.columnIndex !== undefined
                  ? (p.columnIndex + 1) / p.totalColumns
                  : 0;
              overallProgress = Math.round(40 + chunkBase + (colPct * 50) / Math.max(total, 1));
            } else if (p.phase === "merging") {
              overallProgress = 95;
            }

            return {
              ...prev,
              phase: p.phase,
              currentChunk: chunkDisplay,
              totalChunks: total,
              currentColumn: p.columnName ?? prev.currentColumn,
              columnProgress:
                p.totalColumns && p.columnIndex !== undefined
                  ? Math.round(((p.columnIndex + 1) / p.totalColumns) * 100)
                  : prev.columnProgress,
              overallProgress: Math.min(95, overallProgress),
            };
          });
        });

        // Store merged profiles and a synthetic ParsedData (sample rows for DQ runner)
        setProfiles(result.mergedProfiles, assetId);
        setData({
          headers: result.headers,
          rows: result.sampleRows,
          totalRows: result.totalRows,
          sampleMode: true,
          fileName: file.name,
          fileSize: file.size,
        });

        setState((prev) => ({
          ...prev,
          phase: "done",
          overallProgress: 100,
          totalRows: result.totalRows,
          totalChunks: result.totalChunks,
        }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bulk file processing failed";
        setState((prev) => ({ ...prev, phase: "error", error: msg }));
      }
    },
    [clearData, clearProfiles, clearGlobalScope, setData, setProfiles]
  );

  const reset = useCallback(() => {
    clearData();
    clearProfiles();
    clearGlobalScope();
    setState(INITIAL);
  }, [clearData, clearProfiles, clearGlobalScope]);

  return { state, start, reset };
}
