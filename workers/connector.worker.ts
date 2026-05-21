/// <reference lib="webworker" />
/**
 * connector.worker.ts
 *
 * Fetches data from browser-native sources (Google Sheets, Airtable,
 * pre-signed cloud storage URLs, REST APIs) and returns ParsedData in
 * exactly the same shape as file-parser.worker.ts.
 *
 * Raw data NEVER reaches Sohovi's servers — all processing stays here.
 * Max rows: 50 000 (matching file-parser sampling limit).
 */

import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ConnectorCommand, ConnectorResponse } from "@/types/connectors.types";
import type { ParsedData } from "@/types/profiling.types";

const MAX_ROWS = 50_000;

function post(msg: ConnectorResponse) {
  self.postMessage(msg);
}

function progress(pct: number, message: string) {
  post({ type: "CONNECT_PROGRESS", payload: { pct, message } });
}

self.onmessage = async (e: MessageEvent<ConnectorCommand>) => {
  try {
    switch (e.data.type) {
      case "CONNECT_GOOGLE_SHEETS":
        await fetchGoogleSheets(e.data.payload.auth, e.data.payload.config);
        break;
      case "CONNECT_AIRTABLE":
        await fetchAirtable(e.data.payload.auth, e.data.payload.config);
        break;
      case "CONNECT_CLOUD_URL":
        await fetchCloudStorageUrl(e.data.payload.config);
        break;
      case "CONNECT_REST_API":
        await fetchRestApi(e.data.payload.config);
        break;
    }
  } catch (err) {
    post({
      type: "CONNECT_ERROR",
      payload: { message: err instanceof Error ? err.message : "Connection failed" },
    });
  }
};

// ---- Google Sheets ---------------------------------------------------

async function fetchGoogleSheets(
  auth: { access_token: string },
  config: { spreadsheet_id: string; sheet_name: string }
) {
  progress(10, "Connecting to Google Sheets…");

  const encodedSheet = encodeURIComponent(config.sheet_name);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheet_id}/values/${encodedSheet}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${auth.access_token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = (body as { error?: { message?: string } }).error?.message ?? res.statusText;
    throw new Error(`Google Sheets API error: ${msg}`);
  }

  progress(50, "Parsing sheet data…");

  const data = (await res.json()) as { values?: string[][] };
  const values = data.values ?? [];

  if (values.length === 0) throw new Error("Sheet is empty");

  const headers = values[0].map((h) => String(h ?? "").trim());
  const allRows = values.slice(1).map((row) =>
    headers.map((_, i) => {
      const v = row[i];
      return v === undefined || v === null || String(v).trim() === "" ? null : String(v).trim();
    })
  );

  progress(90, "Finalizing…");
  complete(headers, allRows, `${config.sheet_name} (Google Sheets)`, 0);
}

// ---- Airtable --------------------------------------------------------

async function fetchAirtable(
  auth: { personal_access_token: string },
  config: { base_id: string; table_id_or_name: string }
) {
  progress(10, "Connecting to Airtable…");

  const table = encodeURIComponent(config.table_id_or_name);
  let offset: string | undefined;
  const allRecords: Record<string, unknown>[] = [];

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${config.base_id}/${table}?${params}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${auth.personal_access_token}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = (body as { error?: { message?: string } }).error?.message ?? res.statusText;
      throw new Error(`Airtable API error: ${msg}`);
    }

    const json = (await res.json()) as {
      records: { fields: Record<string, unknown> }[];
      offset?: string;
    };

    allRecords.push(...json.records.map((r) => r.fields));
    offset = json.offset;

    const pct = Math.min(85, 10 + Math.floor((allRecords.length / Math.max(allRecords.length, 1)) * 75));
    progress(pct, `Fetched ${allRecords.length} records…`);
  } while (offset && allRecords.length < MAX_ROWS);

  if (allRecords.length === 0) throw new Error("Table is empty or has no records");

  progress(90, "Parsing records…");

  // Build column headers from all records' keys (union)
  const headerSet = new Set<string>();
  for (const rec of allRecords) {
    for (const key of Object.keys(rec)) headerSet.add(key);
  }
  const headers = Array.from(headerSet);

  const rows = allRecords.map((rec) =>
    headers.map((h) => {
      const v = rec[h];
      if (v === null || v === undefined) return null;
      if (Array.isArray(v)) return v.join(", ");
      return String(v).trim() || null;
    })
  );

  complete(headers, rows, `${config.table_id_or_name} (Airtable)`, 0);
}

// ---- Cloud Storage URL (S3, Azure, GCS — pre-signed/SAS/signed) -------

async function fetchCloudStorageUrl(config: { url: string; file_hint?: string }) {
  progress(10, "Fetching file…");

  const res = await fetch(config.url);
  if (!res.ok) throw new Error(`Failed to fetch file: HTTP ${res.status} ${res.statusText}`);

  const contentType = res.headers.get("content-type") ?? "";
  const urlPath = new URL(config.url).pathname.toLowerCase();
  const ext = urlPath.split(".").pop() ?? "";

  const buffer = await res.arrayBuffer();
  progress(50, "Parsing file…");

  if (ext === "csv" || ext === "txt" || contentType.includes("text/csv") || contentType.includes("text/plain")) {
    await parseCSVBuffer(buffer, config.file_hint ?? urlPath.split("/").pop() ?? "file.csv");
  } else if (["xlsx", "xls", "ods", "xlsm"].includes(ext) || contentType.includes("spreadsheet")) {
    await parseExcelBuffer(buffer, config.file_hint ?? urlPath.split("/").pop() ?? "file.xlsx");
  } else if (ext === "json" || contentType.includes("application/json")) {
    const text = new TextDecoder().decode(buffer);
    const json = JSON.parse(text) as unknown;
    const rows = Array.isArray(json) ? json : null;
    if (!rows) throw new Error("JSON file must be a top-level array of objects");
    const headers = Array.from(new Set(rows.flatMap((r) => (typeof r === "object" && r ? Object.keys(r) : []))));
    const dataRows = rows.map((rec) =>
      headers.map((h) => {
        const v = (rec as Record<string, unknown>)[h];
        return v == null ? null : String(v);
      })
    );
    complete(headers, dataRows, config.file_hint ?? "file.json", buffer.byteLength);
  } else {
    throw new Error(`Unsupported file type: .${ext}. Use a CSV, Excel, or JSON file.`);
  }
}

async function parseCSVBuffer(buffer: ArrayBuffer, fileName: string) {
  const text = new TextDecoder("utf-8").decode(buffer);
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true, dynamicTyping: false });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(result.errors[0].message);
  }
  if (result.data.length === 0) throw new Error("File is empty");

  const headers = result.data[0].map((h) => String(h ?? "").trim());
  const rows = result.data.slice(1).map((row) =>
    headers.map((_, i) => {
      const v = row[i];
      return v === undefined || v === null || v === "" ? null : String(v).trim();
    })
  );

  complete(headers, rows, fileName, buffer.byteLength);
}

async function parseExcelBuffer(buffer: ArrayBuffer, fileName: string) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Excel file has no sheets");

  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<(string | null)[]>(sheet, {
    header: 1,
    defval: null,
    raw: false,
  });

  if (raw.length === 0) throw new Error("Sheet is empty");

  const headers = (raw[0] as (string | null)[]).map((h) => String(h ?? "").trim());
  const rows = raw.slice(1).map((row) =>
    headers.map((_, i) => {
      const v = (row as (string | null)[])[i];
      return v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim();
    })
  );

  complete(headers, rows, fileName, buffer.byteLength);
}

// ---- Generic REST API ------------------------------------------------

async function fetchRestApi(config: {
  url: string;
  json_path: string;
  auth?: { header_name: string; header_value: string };
}) {
  progress(10, "Connecting to API…");

  const headers: Record<string, string> = { Accept: "application/json" };
  if (config.auth) {
    headers[config.auth.header_name] = config.auth.header_value;
  }

  const res = await fetch(config.url, { headers });

  if (!res.ok) throw new Error(`API error: HTTP ${res.status} ${res.statusText}`);

  progress(50, "Parsing response…");

  const json = await res.json() as unknown;

  // Traverse the dot-notation json_path
  const records = traversePath(json, config.json_path);

  if (!Array.isArray(records)) {
    throw new Error(
      `json_path "${config.json_path}" did not point to an array. Got: ${typeof records}`
    );
  }
  if (records.length === 0) throw new Error("API returned an empty array");

  const headerSet = new Set<string>();
  for (const rec of records) {
    if (typeof rec === "object" && rec !== null) {
      for (const key of Object.keys(rec)) headerSet.add(key);
    }
  }
  const headers2 = Array.from(headerSet);

  const rows = records.map((rec) =>
    headers2.map((h) => {
      const v = (rec as Record<string, unknown>)[h];
      if (v == null) return null;
      if (typeof v === "object") return JSON.stringify(v);
      return String(v).trim() || null;
    })
  );

  progress(90, "Finalizing…");
  complete(headers2, rows.slice(0, MAX_ROWS), config.url, 0);
}

function traversePath(obj: unknown, path: string): unknown {
  if (!path || path === ".") return obj;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

// ---- Shared finalizer ------------------------------------------------

function complete(
  headers: string[],
  allRows: (string | null)[][],
  fileName: string,
  fileSize: number
) {
  let rows = allRows;
  let sampleMode = false;

  if (allRows.length > MAX_ROWS) {
    sampleMode = true;
    rows = allRows.slice(0, MAX_ROWS);
  }

  progress(95, "Done");

  const payload: ParsedData = {
    headers,
    rows,
    totalRows: allRows.length,
    sampleMode,
    fileName,
    fileSize,
  };

  post({ type: "CONNECT_COMPLETE", payload });
}
