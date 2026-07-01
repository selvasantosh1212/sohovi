"use client";

import { useState, useCallback } from "react";
import { parseFile } from "@/workers/worker-bridge";
import { useFileStore } from "@/store/fileStore";
import { useGlobalScopeFilterStore } from "@/store/globalScopeFilterStore";

export type ParseStatus = "idle" | "parsing" | "done" | "error";

export interface UseFileWorkerResult {
  status: ParseStatus;
  progress: number; // 0–100
  rowsProcessed: number;
  error: string | null;
  startParsing: (file: File) => Promise<void>;
  reset: () => void;
}

export function useFileWorker(): UseFileWorkerResult {
  const [status, setStatus] = useState<ParseStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [rowsProcessed, setRowsProcessed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const setData = useFileStore((s) => s.setData);
  const clearData = useFileStore((s) => s.clear);
  const clearGlobalScope = useGlobalScopeFilterStore((s) => s.clear);

  const startParsing = useCallback(
    async (file: File) => {
      clearData();
      clearGlobalScope();
      setStatus("parsing");
      setProgress(0);
      setRowsProcessed(0);
      setError(null);

      try {
        const data = await parseFile(file, (p) => {
          setProgress(p.pct);
          setRowsProcessed(p.rowsProcessed);
        });
        setData(data);
        setProgress(100);
        setStatus("done");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to parse file";
        setError(msg);
        setStatus("error");
      }
    },
    [setData, clearData, clearGlobalScope]
  );

  const reset = useCallback(() => {
    clearData();
    clearGlobalScope();
    setStatus("idle");
    setProgress(0);
    setRowsProcessed(0);
    setError(null);
  }, [clearData, clearGlobalScope]);

  return { status, progress, rowsProcessed, error, startParsing, reset };
}
