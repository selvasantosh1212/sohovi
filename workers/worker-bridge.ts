/**
 * worker-bridge.ts
 *
 * Typed Promise-based wrappers around Web Workers.
 * All file parsing and profiling stays in the browser — raw data never leaves.
 */

import type {
  FileParseCommand,
  FileParseResponse,
  ParsedData,
  ProfileCommand,
  ProfileResponse,
  ColumnProfile,
} from "@/types/profiling.types";
import type {
  DQRunCommand,
  DQRunResponse,
  DQRunResult,
  RuleConfig,
} from "@/types/dq.types";
import type { ConnectorCommand, ConnectorResponse } from "@/types/connectors.types";

export interface ParseProgress {
  pct: number;
  rowsProcessed: number;
}

export interface ProfileProgress {
  columnIndex: number;
  totalColumns: number;
  columnName: string;
}

/**
 * Parse a file using the file-parser worker.
 * Returns the parsed data and calls onProgress during parsing.
 */
export function parseFile(
  file: File,
  onProgress?: (p: ParseProgress) => void
): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./file-parser.worker.ts", import.meta.url)
    );

    worker.onmessage = (e: MessageEvent<FileParseResponse>) => {
      const msg = e.data;
      if (msg.type === "PARSE_PROGRESS") {
        onProgress?.(msg.payload);
      } else if (msg.type === "PARSE_COMPLETE") {
        worker.terminate();
        resolve(msg.payload);
      } else if (msg.type === "PARSE_ERROR") {
        worker.terminate();
        reject(new Error(msg.payload.message));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    file.arrayBuffer().then((buffer) => {
      const cmd: FileParseCommand = {
        type: "PARSE",
        payload: { buffer, fileName: file.name, fileSize: file.size },
      };
      worker.postMessage(cmd, [buffer]);
    });
  });
}

/**
 * Profile parsed data using the profiler worker.
 * Returns column profiles and calls onProgress per column.
 */
export function profileData(
  headers: string[],
  rows: (string | null)[][],
  onProgress?: (p: ProfileProgress) => void
): Promise<ColumnProfile[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./profiler.worker.ts", import.meta.url)
    );

    worker.onmessage = (e: MessageEvent<ProfileResponse>) => {
      const msg = e.data;
      if (msg.type === "PROFILE_PROGRESS") {
        onProgress?.(msg.payload);
      } else if (msg.type === "PROFILE_COMPLETE") {
        worker.terminate();
        resolve(msg.payload.profiles);
      } else if (msg.type === "PROFILE_ERROR") {
        worker.terminate();
        reject(new Error(msg.payload.message));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    const cmd: ProfileCommand = {
      type: "PROFILE",
      payload: { headers, rows },
    };
    worker.postMessage(cmd);
  });
}

export interface ConnectorProgress {
  pct: number;
  message: string;
}

/**
 * Connect to a data source using the connector worker.
 * Returns ParsedData in the same format as parseFile() — feeds directly
 * into the existing profiler and DQ pipeline.
 */
export function connectAndFetch(
  command: ConnectorCommand,
  onProgress?: (p: ConnectorProgress) => void
): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./connector.worker.ts", import.meta.url)
    );

    worker.onmessage = (e: MessageEvent<ConnectorResponse>) => {
      const msg = e.data;
      if (msg.type === "CONNECT_PROGRESS") {
        onProgress?.(msg.payload);
      } else if (msg.type === "CONNECT_COMPLETE") {
        worker.terminate();
        resolve(msg.payload);
      } else if (msg.type === "CONNECT_ERROR") {
        worker.terminate();
        reject(new Error(msg.payload.message));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    worker.postMessage(command);
  });
}

export interface BulkProgress {
  phase: "splitting" | "profiling" | "merging";
  /** Current chunk index (0-based). -1 = total unknown (CSV streaming). */
  chunkIndex: number;
  /** Total chunks. -1 when not yet known (CSV streaming). */
  totalChunks: number;
  columnIndex?: number;
  totalColumns?: number;
  columnName?: string;
}

export interface BulkResult {
  mergedProfiles: ColumnProfile[];
  sampleRows: (string | null)[][];
  headers: string[];
  totalRows: number;
  totalChunks: number;
}

export interface DQRunProgress {
  ruleIndex: number;
  totalRules: number;
  label: string;
}

/**
 * Run DQ rules against parsed data using the dq-runner worker.
 * Returns a DQRunResult and calls onProgress per rule evaluated.
 */
export function runDQRules(
  headers: string[],
  rows: (string | null)[][],
  rules: RuleConfig[],
  assetId: string,
  onProgress?: (p: DQRunProgress) => void
): Promise<DQRunResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./dq-runner.worker.ts", import.meta.url)
    );

    worker.onmessage = (e: MessageEvent<DQRunResponse>) => {
      const msg = e.data;
      if (msg.type === "RUN_PROGRESS") {
        onProgress?.(msg.payload);
      } else if (msg.type === "RUN_COMPLETE") {
        worker.terminate();
        resolve(msg.payload);
      } else if (msg.type === "RUN_ERROR") {
        worker.terminate();
        reject(new Error(msg.payload.message));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    const cmd: DQRunCommand = {
      type: "RUN",
      payload: { rows, headers, rules, asset_id: assetId },
    };
    worker.postMessage(cmd);
  });
}

/**
 * Process a large file (up to 1 GB) using the bulk-file worker.
 * The worker streams the file in 500k-row chunks, profiles each chunk,
 * then merges all chunk profiles into one combined result.
 * Returns merged profiles + a combined row sample for DQ evaluation.
 */
export function processBulkFile(
  file: File,
  onProgress?: (p: BulkProgress) => void
): Promise<BulkResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./bulk-file.worker.ts", import.meta.url)
    );

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as { type: string; payload: unknown };
      if (msg.type === "BULK_PROGRESS") {
        onProgress?.(msg.payload as BulkProgress);
      } else if (msg.type === "BULK_COMPLETE") {
        worker.terminate();
        resolve(msg.payload as BulkResult);
      } else if (msg.type === "BULK_ERROR") {
        worker.terminate();
        reject(new Error((msg.payload as { message: string }).message));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    worker.postMessage({ type: "BULK_FILE", payload: { file } });
  });
}
