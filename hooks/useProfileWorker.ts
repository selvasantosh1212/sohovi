"use client";

import { useState, useCallback } from "react";
import { profileData } from "@/workers/worker-bridge";
import { useFileStore } from "@/store/fileStore";
import { useProfilingStore } from "@/store/profilingStore";

export type ProfileStatus = "idle" | "profiling" | "done" | "error";

export interface UseProfileWorkerResult {
  status: ProfileStatus;
  progress: number; // 0–100
  currentColumn: string | null;
  columnsProcessed: number;
  totalColumns: number;
  error: string | null;
  startProfiling: (assetId: string) => Promise<void>;
  reset: () => void;
}

export function useProfileWorker(): UseProfileWorkerResult {
  const [status, setStatus] = useState<ProfileStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentColumn, setCurrentColumn] = useState<string | null>(null);
  const [columnsProcessed, setColumnsProcessed] = useState(0);
  const [totalColumns, setTotalColumns] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileData = useFileStore((s) => s.data);
  const setProfiles = useProfilingStore((s) => s.setProfiles);
  const clearProfiles = useProfilingStore((s) => s.clear);

  const startProfiling = useCallback(
    async (assetId: string) => {
      if (!fileData) {
        setError("No file data to profile. Upload a file first.");
        setStatus("error");
        return;
      }

      clearProfiles();
      setStatus("profiling");
      setProgress(0);
      setCurrentColumn(null);
      setColumnsProcessed(0);
      setTotalColumns(fileData.headers.length);
      setError(null);

      try {
        const profiles = await profileData(
          fileData.headers,
          fileData.rows,
          (p) => {
            setCurrentColumn(p.columnName);
            setColumnsProcessed(p.columnIndex + 1);
            setProgress(Math.round(((p.columnIndex + 1) / p.totalColumns) * 100));
          }
        );
        setProfiles(profiles, assetId);
        setProgress(100);
        setStatus("done");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to profile data";
        setError(msg);
        setStatus("error");
      }
    },
    [fileData, setProfiles, clearProfiles]
  );

  const reset = useCallback(() => {
    clearProfiles();
    setStatus("idle");
    setProgress(0);
    setCurrentColumn(null);
    setColumnsProcessed(0);
    setError(null);
  }, [clearProfiles]);

  return {
    status,
    progress,
    currentColumn,
    columnsProcessed,
    totalColumns,
    error,
    startProfiling,
    reset,
  };
}
