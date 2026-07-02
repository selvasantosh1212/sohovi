"use client";

import { useState, useCallback } from "react";
import { connectAndFetch } from "@/workers/worker-bridge";
import { useFileStore } from "@/store/fileStore";
import type { ConnectorCommand } from "@/types/connectors.types";

export type ConnectStatus = "idle" | "connecting" | "done" | "error";

export interface UseConnectorWorkerResult {
  status: ConnectStatus;
  progress: number;
  progressMessage: string;
  error: string | null;
  startConnect: (command: ConnectorCommand) => Promise<void>;
  reset: () => void;
}

export function useConnectorWorker(): UseConnectorWorkerResult {
  const [status, setStatus] = useState<ConnectStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setData = useFileStore((s) => s.setData);
  const clearData = useFileStore((s) => s.clear);

  const startConnect = useCallback(
    async (command: ConnectorCommand) => {
      clearData();
      setStatus("connecting");
      setProgress(0);
      setProgressMessage("Initializing…");
      setError(null);

      try {
        const data = await connectAndFetch(command, (p) => {
          setProgress(p.pct);
          setProgressMessage(p.message);
        });
        setData(data);
        setProgress(100);
        setStatus("done");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Connection failed";
        setError(msg);
        setStatus("error");
      }
    },
    [setData, clearData]
  );

  const reset = useCallback(() => {
    clearData();
    setStatus("idle");
    setProgress(0);
    setProgressMessage("");
    setError(null);
  }, [clearData]);

  return { status, progress, progressMessage, error, startConnect, reset };
}
