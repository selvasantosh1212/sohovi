/// <reference lib="webworker" />
/**
 * bulk-file.worker.ts
 *
 * Handles large file processing (up to 1 GB) by:
 *   1. Streaming the file in row-based chunks (CSV) or slicing rows (Excel)
 *   2. Profiling each chunk using profileColumn() directly
 *   3. Merging all chunk profiles into one combined ColumnProfile[]
 *   4. Collecting a proportional row sample for DQ evaluation
 *
 * Raw data NEVER leaves the browser. All computation is in this worker thread.
 */

import Papa from "papaparse";
import * as XLSX from "xlsx";
import { profileColumn } from "@/lib/profiling/profiler";
import { mergeColumnProfiles } from "@/lib/profiling/profile-merger";
import type { ColumnProfile } from "@/types/profiling.types";

const CHUNK_ROW_SIZE = 500_000;
const SAMPLE_PER_CHUNK = 5_000;
const MAX_SAMPLE_ROWS = 50_000;

// ── Message protocol ────────────────────────────────────────────────────────

export type BulkFileCommand = {
  type: "BULK_FILE";
  payload: { file: File };
};

export type BulkFileProgress = {
  phase: "splitting" | "profiling" | "merging";
  chunkIndex: number;
  /** -1 when total is not yet known (CSV streaming) */
  totalChunks: number;
  columnIndex?: number;
  totalColumns?: number;
  columnName?: string;
};

export type BulkFileComplete = {
  mergedProfiles: ColumnProfile[];
  sampleRows: (string | null)[][];
  headers: string[];
  totalRows: number;
  totalChunks: number;
};

export type BulkFileResponse =
  | { type: "BULK_PROGRESS"; payload: BulkFileProgress }
  | { type: "BULK_COMPLETE"; payload: BulkFileComplete }
  | { type: "BULK_ERROR"; payload: { message: string } };

function post(msg: BulkFileResponse) {
  self.postMessage(msg);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeCell(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function normalizeRow(raw: unknown[], colCount: number): (string | null)[] {
  return Array.from({ length: colCount }, (_, i) => normalizeCell(raw[i]));
}

/** Profile all columns of one chunk, posting per-column progress. */
function profileChunk(
  headers: string[],
  rows: (string | null)[][],
  chunkIndex: number,
  totalChunks: number
): ColumnProfile[] {
  return headers.map((colName, colIndex) => {
    post({
      type: "BULK_PROGRESS",
      payload: {
        phase: "profiling",
        chunkIndex,
        totalChunks,
        columnIndex: colIndex,
        totalColumns: headers.length,
        columnName: colName,
      },
    });
    const values = rows.map((row) => row[colIndex] ?? null);
    return profileColumn(colName, values);
  });
}

// ── Entry point ──────────────────────────────────────────────────────────────

self.onmessage = async (e: MessageEvent<BulkFileCommand>) => {
  if (e.data.type !== "BULK_FILE") return;
  const { file } = e.data.payload;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  try {
    if (ext === "csv" || ext === "txt") {
      await processCSV(file);
    } else if (["xlsx", "xls", "ods", "xlsm"].includes(ext)) {
      await processExcel(file);
    } else {
      post({
        type: "BULK_ERROR",
        payload: { message: `Unsupported file type: .${ext}. Upload a CSV or Excel file.` },
      });
    }
  } catch (err) {
    post({
      type: "BULK_ERROR",
      payload: { message: err instanceof Error ? err.message : "Unknown bulk-file error" },
    });
  }
};

// ── CSV path (streaming — memory-safe for files up to 1 GB) ─────────────────

async function processCSV(file: File) {
  const allChunkProfiles: ColumnProfile[][] = [];
  const allSampleRows: (string | null)[][] = [];
  let headers: string[] = [];
  let rowBuffer: (string | null)[][] = [];
  let totalRows = 0;

  await new Promise<void>((resolve, reject) => {
    // PapaParse reads the File in chunkSize-byte pieces via FileReader.
    // The chunk callback fires for each piece — we accumulate rows in rowBuffer
    // and flush into a profiling chunk once we reach CHUNK_ROW_SIZE.
    (Papa as typeof Papa).parse(file as unknown as string, {
      header: false,
      skipEmptyLines: true,
      chunkSize: 10 * 1024 * 1024, // 10 MB per read — keeps raw bytes memory-bound
      chunk(results: Papa.ParseResult<string[]>) {
        const rawRows = results.data;
        if (rawRows.length === 0) return;

        // First chunk contains the header row at index 0
        if (headers.length === 0) {
          headers = rawRows[0].map((h) => String(h ?? "").trim());
          for (let i = 1; i < rawRows.length; i++) {
            rowBuffer.push(normalizeRow(rawRows[i], headers.length));
          }
        } else {
          for (const raw of rawRows) {
            rowBuffer.push(normalizeRow(raw, headers.length));
          }
        }

        // Profile whenever we have enough rows for a full chunk
        while (rowBuffer.length >= CHUNK_ROW_SIZE) {
          const chunk = rowBuffer.splice(0, CHUNK_ROW_SIZE);
          totalRows += chunk.length;
          const chunkIdx = allChunkProfiles.length;

          post({
            type: "BULK_PROGRESS",
            payload: { phase: "splitting", chunkIndex: chunkIdx, totalChunks: -1 },
          });

          allChunkProfiles.push(profileChunk(headers, chunk, chunkIdx, -1));
          allSampleRows.push(...chunk.slice(0, SAMPLE_PER_CHUNK));
        }
      },
      complete() {
        // Profile any remaining rows
        if (rowBuffer.length > 0) {
          totalRows += rowBuffer.length;
          const chunkIdx = allChunkProfiles.length;
          post({
            type: "BULK_PROGRESS",
            payload: { phase: "splitting", chunkIndex: chunkIdx, totalChunks: chunkIdx + 1 },
          });
          allChunkProfiles.push(profileChunk(headers, rowBuffer, chunkIdx, chunkIdx + 1));
          allSampleRows.push(...rowBuffer.slice(0, SAMPLE_PER_CHUNK));
          rowBuffer = [];
        }
        resolve();
      },
      error(err: Error) {
        reject(err);
      },
    });
  });

  if (headers.length === 0) {
    post({ type: "BULK_ERROR", payload: { message: "CSV file appears to be empty." } });
    return;
  }

  finalize(headers, allChunkProfiles, allSampleRows, totalRows);
}

// ── Excel path (full read + row slicing) ─────────────────────────────────────

async function processExcel(file: File) {
  post({ type: "BULK_PROGRESS", payload: { phase: "splitting", chunkIndex: 0, totalChunks: -1 } });

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Excel file has no sheets.");

  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<(string | null)[]>(sheet, {
    header: 1,
    defval: null,
    raw: false,
  });

  if (raw.length === 0) throw new Error("Excel sheet is empty.");

  const headers = (raw[0] as (string | null)[]).map((h) => String(h ?? "").trim());
  const allDataRows = (raw.slice(1) as (string | null)[][]).map((row) =>
    normalizeRow(row, headers.length)
  );

  const totalChunks = Math.max(1, Math.ceil(allDataRows.length / CHUNK_ROW_SIZE));
  const allChunkProfiles: ColumnProfile[][] = [];
  const allSampleRows: (string | null)[][] = [];

  for (let start = 0; start < allDataRows.length; start += CHUNK_ROW_SIZE) {
    const chunk = allDataRows.slice(start, start + CHUNK_ROW_SIZE);
    const chunkIdx = allChunkProfiles.length;

    post({
      type: "BULK_PROGRESS",
      payload: { phase: "splitting", chunkIndex: chunkIdx, totalChunks },
    });

    allChunkProfiles.push(profileChunk(headers, chunk, chunkIdx, totalChunks));
    allSampleRows.push(...chunk.slice(0, SAMPLE_PER_CHUNK));
  }

  finalize(headers, allChunkProfiles, allSampleRows, allDataRows.length);
}

// ── Merge + emit ─────────────────────────────────────────────────────────────

function finalize(
  headers: string[],
  allChunkProfiles: ColumnProfile[][],
  allSampleRows: (string | null)[][],
  totalRows: number
) {
  const totalChunks = allChunkProfiles.length;

  post({
    type: "BULK_PROGRESS",
    payload: { phase: "merging", chunkIndex: totalChunks, totalChunks },
  });

  const mergedProfiles = mergeColumnProfiles(allChunkProfiles);
  const sampleRows = allSampleRows.slice(0, MAX_SAMPLE_ROWS);

  post({
    type: "BULK_COMPLETE",
    payload: { mergedProfiles, sampleRows, headers, totalRows, totalChunks },
  });
}
