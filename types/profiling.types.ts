// ============================================================
// Profiling types — computed entirely client-side in Web Workers
// Raw data NEVER leaves the browser
// ============================================================

export type InferredType =
  | "integer"
  | "float"
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "phone"
  | "url"
  | "uuid"
  | "json"
  | "string"
  | "mixed";

export type PIIType =
  | "email"
  | "phone"
  | "ssn"
  | "credit_card"
  | "ip_address"
  | "person_name";

export type DateFormatKey =
  | "YYYY-MM-DD"
  | "DD-MM-YYYY"
  | "MM-DD-YYYY"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY/MM/DD"
  | "DD.MM.YYYY"
  | "DD-MM-YY"
  | "MM-DD-YY"
  | "DD/MM/YY"
  | "MM/DD/YY"
  | "YYYYMMDD";

export type DateFormatAmbiguity = "unambiguous" | "day_first" | "month_first" | "ambiguous";

export interface DetectedDateFormat {
  format: DateFormatKey;
  templateKey: string;
  matchCount: number;
  matchPct: number;
  confidence: number;
  ambiguity: DateFormatAmbiguity;
  exampleValues: string[];
}

export interface ValueFreq {
  value: string;
  count: number;
  pct: number;
}

export interface PatternEntry {
  pattern: string;
  count: number;
  pct: number;
}

/** In-memory column profile — computed by profiler.worker.ts */
export interface ColumnProfile {
  column_name: string;
  inferred_type: InferredType;
  row_count: number;
  null_count: number;
  null_pct: number;
  unique_count: number;
  unique_pct: number;
  min_value: string | null;
  max_value: string | null;
  avg_value: number | null;
  std_dev: number | null;
  min_length: number | null;
  max_length: number | null;
  avg_length: number | null;
  top_values: ValueFreq[];
  bottom_values: ValueFreq[];
  value_frequency: ValueFreq[];
  pattern_summary: PatternEntry[];
  pii_detected: boolean;
  pii_type: PIIType | null;
  outlier_count: number;
  outlier_values: number[];
  sample_values: string[]; // masked if PII
  detected_date_formats: DetectedDateFormat[] | null;
}

// ============================================================
// File that has been parsed and stored in fileStore
// ============================================================

export interface ParsedData {
  headers: string[];
  rows: (string | null)[][];
  totalRows: number;
  sampleMode: boolean;
  fileName: string;
  fileSize: number;
  /** First 15 raw rows including the original header row (index 0).
   *  Used by HeaderRowSelector to let users pick a different header row. */
  previewRows?: (string | null)[][];
}

// ============================================================
// Web Worker message protocol
// ============================================================

// --- File Parser Worker ---

export type FileParseCommand = {
  type: "PARSE";
  payload: {
    buffer: ArrayBuffer;
    fileName: string;
    fileSize: number;
  };
};

export type FileParseResponse =
  | { type: "PARSE_PROGRESS"; payload: { pct: number; rowsProcessed: number } }
  | { type: "PARSE_COMPLETE"; payload: ParsedData }
  | { type: "PARSE_ERROR"; payload: { message: string } };

// --- Profiler Worker ---

export type ProfileCommand = {
  type: "PROFILE";
  payload: {
    headers: string[];
    rows: (string | null)[][];
  };
};

export type ProfileResponse =
  | {
      type: "PROFILE_PROGRESS";
      payload: { columnIndex: number; totalColumns: number; columnName: string };
    }
  | { type: "PROFILE_COMPLETE"; payload: { profiles: ColumnProfile[] } }
  | { type: "PROFILE_ERROR"; payload: { message: string } };
