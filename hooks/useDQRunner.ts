/**
 * useDQRunner.ts
 *
 * React hook that manages the DQ runner worker lifecycle.
 * Reads from fileStore (raw rows) and profilingStore (for context).
 * Writes result to dqStore.
 */

"use client";

import { useCallback, useState } from "react";
import { runDQRules, type DQRunProgress } from "@/workers/worker-bridge";
import { useFileStore } from "@/store/fileStore";
import { useDQStore } from "@/store/dqStore";
import type { RuleConfig, ScopeCondition } from "@/types/dq.types";

type RunStatus = "idle" | "running" | "done" | "error";

export function useDQRunner() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState<DQRunProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileData = useFileStore((s) => s.data);
  const setResult = useDQStore((s) => s.setResult);

  const startRun = useCallback(
    async (rules: RuleConfig[], assetId: string, scopeConditionsGlobal: ScopeCondition[] = []) => {
      if (!fileData) {
        setError("No file data in memory — please upload a file first.");
        setStatus("error");
        return;
      }
      if (rules.length === 0) {
        setError("No active rules to run.");
        setStatus("error");
        return;
      }

      setStatus("running");
      setError(null);
      setProgress(null);

      try {
        const result = await runDQRules(
          fileData.headers,
          fileData.rows,
          rules,
          assetId,
          scopeConditionsGlobal,
          (p) => setProgress(p)
        );

        setResult(result, assetId, scopeConditionsGlobal);
        setStatus("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    },
    [fileData, setResult]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, []);

  return { status, progress, error, startRun, reset };
}
