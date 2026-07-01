/// <reference lib="webworker" />
/**
 * bulk-file.worker.ts
 *
 * Handles large file processing (up to 1 GB) by:
 *   1. Streaming the file in row-based chunks (CSV) or slicing rows (Excel)
 *   2. Profiling each chunk via profileColumnWithSketches(), which carries
 *      forward mergeable HyperLogLog/t-digest sketch state alongside each
 *      chunk's plain ColumnProfile
 *   3. Merging all chunk results into one combined ColumnProfile[], unioning
 *      sketches for accurate dataset-wide cardinality/quantile estimates
 *   4. Collecting a uniform reservoir-sampled row sample for DQ evaluation
 *
 * Raw data NEVER leaves the browser. All computation is in this worker thread.
 */

import Papa from "papaparse";
import * as XLSX from "xlsx";
import { profileColumnWithSketches } from "@/lib/profiling/profiler";
import { mergeColumnProfiles, type ChunkColumnResult } from "@/lib/profiling/profile-merger";
import { ReservoirSampler } from "@/lib/profiling/sketches";
import type { ColumnProfile } from "@/types/profiling.types";

// Bounds the raw row buffer held in memory per chunk — this (not the
// frequency-map memory, which the HyperLogLog fast-path in profiler.ts now
// bounds independently) is the binding memory constraint here, so it isn't
// relaxed even though sketches reduce other memory pressure.
const CHUNK_ROW_SIZE = 500_000;
// Reservoir capacity for the combined row sample (see ReservoirSampler) —
// previously this was an accumulate-everything-then-truncate cap, so memory
// could briefly balloon to (chunk count x per-chunk slice) before the final
// slice(0, MAX_SAMPLE_ROWS). It's now a hard ceiling at all times, and the
// sample is uniform across the whole file instead of biased to the start of
// each chunk.
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
): ChunkColumnResult[] {
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
    return profileColumnWithSketches(colName, values);
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
  const allChunkProfiles: ChunkColumnResult[][] = [];
  const sampler = new ReservoirSampler<(string | null)[]>(MAX_SAMPLE_ROWS);
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
          for (const row of chunk) sampler.add(row);
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
          for (const row of rowBuffer) sampler.add(row);
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

  finalize(headers, allChunkProfiles, sampler.values(), totalRows);
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
  const allChunkProfiles: ChunkColumnResult[][] = [];
  const sampler = new ReservoirSampler<(string | null)[]>(MAX_SAMPLE_ROWS);

  for (let start = 0; start < allDataRows.length; start += CHUNK_ROW_SIZE) {
    const chunk = allDataRows.slice(start, start + CHUNK_ROW_SIZE);
    const chunkIdx = allChunkProfiles.length;

    post({
      type: "BULK_PROGRESS",
      payload: { phase: "splitting", chunkIndex: chunkIdx, totalChunks },
    });

    allChunkProfiles.push(profileChunk(headers, chunk, chunkIdx, totalChunks));
    for (const row of chunk) sampler.add(row);
  }

  finalize(headers, allChunkProfiles, sampler.values(), allDataRows.length);
}

// ── Merge + emit ─────────────────────────────────────────────────────────────

function finalize(
  headers: string[],
  allChunkProfiles: ChunkColumnResult[][],
  sampleRows: (string | null)[][],
  totalRows: number
) {
  const totalChunks = allChunkProfiles.length;

  post({
    type: "BULK_PROGRESS",
    payload: { phase: "merging", chunkIndex: totalChunks, totalChunks },
  });

  const mergedProfiles = mergeColumnProfiles(allChunkProfiles);

  post({
    type: "BULK_COMPLETE",
    payload: { mergedProfiles, sampleRows, headers, totalRows, totalChunks },
  });
}
