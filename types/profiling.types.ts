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
  /** True when unique_count came from a HyperLogLog estimate (extreme-cardinality
   *  column) rather than an exact distinct count. Absent/false = exact. */
  unique_count_approximate?: boolean;
  /** Which method flagged outlier_values. Absent = legacy 3-sigma (pre-Session-11). */
  outlier_method?: "iqr" | "zscore";
  /** Threshold(s) used to flag outlier_values — IQR bounds when outlier_method
   *  is "iqr", or mean ± 3σ when "zscore". Null when the column has no
   *  numeric stats (no outlier detection ran). */
  outlier_bounds: { lower: number; upper: number } | null;
  /** Distinct values that occur more than once in this column (capped list,
   *  sorted by count desc). */
  duplicate_values: ValueFreq[];
  /** Count of distinct values with more than one occurrence (i.e. duplicate
   *  groups), not individual rows. */
  duplicate_value_count: number;
  /** Total "extra" row occurrences across all duplicate groups — for a value
   *  appearing 5 times, contributes 4. */
  duplicate_row_count: number;
  /** True when duplicate stats were computed from a frequency map that was
   *  capped due to extreme cardinality — duplicate_values may be incomplete. */
  duplicates_approximate?: boolean;
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
