/// <reference lib="webworker" />
/**
 * file-parser.worker.ts
 *
 * Parses CSV (papaparse) or Excel (xlsx/SheetJS) files entirely in-browser.
 * Raw file bytes NEVER leave the browser tab.
 *
 * Sampling strategy:
 * - ≤ 100 000 rows: process all
 * - > 100 000 rows: random sample of 50 000 rows (sampleMode = true)
 * - > 500 000 rows: hard limit — take first 50 000 after shuffle
 */

import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { FileParseCommand, FileParseResponse } from "@/types/profiling.types";

const SAMPLE_LIMIT = 50_000;
const FULL_LIMIT = 100_000;

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function post(msg: FileParseResponse) {
  self.postMessage(msg);
}

self.onmessage = async (e: MessageEvent<FileParseCommand>) => {
  if (e.data.type !== "PARSE") return;

  const { buffer, fileName, fileSize } = e.data.payload;
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  try {
    if (ext === "csv" || ext === "txt") {
      await parseCSV(buffer, fileName, fileSize);
    } else if (["xlsx", "xls", "ods", "xlsm"].includes(ext)) {
      await parseExcel(buffer, fileName, fileSize);
    } else {
      post({ type: "PARSE_ERROR", payload: { message: `Unsupported file type: .${ext}. Please upload a CSV or Excel file.` } });
    }
  } catch (err) {
    post({
      type: "PARSE_ERROR",
      payload: { message: err instanceof Error ? err.message : "Unknown parse error" },
    });
  }
};

async function parseCSV(buffer: ArrayBuffer, fileName: string, fileSize: number) {
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(buffer);

  let allRows: (string | null)[][] = [];
  let headers: string[] = [];

  post({ type: "PARSE_PROGRESS", payload: { pct: 10, rowsProcessed: 0 } });

  const result = Papa.parse<string[]>(text, {
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(result.errors[0].message);
  }

  const data = result.data as string[][];
  if (data.length === 0) throw new Error("File is empty");

  headers = data[0].map((h) => String(h ?? "").trim());
  allRows = data.slice(1).map((row) =>
    headers.map((_, i) => {
      const v = row[i];
      return v === undefined || v === null || v === "" ? null : String(v).trim();
    })
  );

  // previewRows[0] = original header row; previewRows[1..14] = first 14 data rows
  const previewRows: (string | null)[][] = [
    data[0].map((v) => (v === null || v === undefined || v === "" ? null : String(v).trim())),
    ...allRows.slice(0, 14),
  ];

  post({ type: "PARSE_PROGRESS", payload: { pct: 70, rowsProcessed: allRows.length } });

  finalize(headers, allRows, fileName, fileSize, previewRows);
}

async function parseExcel(buffer: ArrayBuffer, fileName: string, fileSize: number) {
  post({ type: "PARSE_PROGRESS", payload: { pct: 10, rowsProcessed: 0 } });

  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Excel file has no sheets");

  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: null,
    raw: false, // always convert to strings
  });

  post({ type: "PARSE_PROGRESS", payload: { pct: 50, rowsProcessed: 0 } });

  if (raw.length === 0) throw new Error("Sheet is empty");

  const headers = (raw[0] as (string | null)[]).map((h) => String(h ?? "").trim());
  const allRows = (raw.slice(1) as (string | null)[][]).map((row) =>
    headers.map((_, i) => {
      const v = row[i];
      return v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim();
    })
  );

  // previewRows[0] = original header row; previewRows[1..14] = first 14 data rows
  const rawRow0 = (raw[0] as (string | null)[]).map(
    (v) => (v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim())
  );
  const previewRows: (string | null)[][] = [rawRow0, ...allRows.slice(0, 14)];

  post({ type: "PARSE_PROGRESS", payload: { pct: 70, rowsProcessed: allRows.length } });

  finalize(headers, allRows, fileName, fileSize, previewRows);
}

function finalize(
  headers: string[],
  allRows: (string | null)[][],
  fileName: string,
  fileSize: number,
  previewRows: (string | null)[][]
) {
  let rows = allRows;
  let sampleMode = false;

  if (allRows.length > FULL_LIMIT) {
    sampleMode = true;
    // Reservoir-style: shuffle indices and take first SAMPLE_LIMIT
    const indices = shuffle(Array.from({ length: allRows.length }, (_, i) => i));
    rows = indices.slice(0, SAMPLE_LIMIT).map((i) => allRows[i]);
    // Sort back to preserve row order
    rows.sort((_, __, ia = 0) => ia);
  }

  post({ type: "PARSE_PROGRESS", payload: { pct: 95, rowsProcessed: rows.length } });

  post({
    type: "PARSE_COMPLETE",
    payload: {
      headers,
      rows,
      totalRows: allRows.length,
      sampleMode,
      fileName,
      fileSize,
      previewRows,
    },
  });
}
