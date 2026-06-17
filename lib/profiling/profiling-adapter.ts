import type { ProfilingSummary } from "@/types/app.types";
import type { ColumnProfile, InferredType, PIIType, ValueFreq, PatternEntry } from "@/types/profiling.types";

/** Convert a stored ProfilingSummary (DB row) into a ColumnProfile (live session type)
 *  so ColumnProfileCard can render historical run data without modification.
 *  Note: outlier_values and sample_values are not persisted (privacy-first), so they default to []. */
export function summaryToProfile(s: ProfilingSummary): ColumnProfile {
  return {
    column_name: s.column_name,
    inferred_type: (s.inferred_type ?? "string") as InferredType,
    row_count: s.row_count ?? 0,
    null_count: s.null_count ?? 0,
    null_pct: s.null_pct ?? 0,
    unique_count: s.unique_count ?? 0,
    unique_pct: s.unique_pct ?? 0,
    min_value: s.min_value,
    max_value: s.max_value,
    avg_value: s.avg_value,
    std_dev: s.std_dev,
    min_length: s.min_length,
    max_length: s.max_length,
    avg_length: s.avg_length,
    top_values: (s.top_values ?? []) as ValueFreq[],
    bottom_values: (s.bottom_values ?? []) as ValueFreq[],
    value_frequency: (s.value_frequency ?? []) as ValueFreq[],
    pattern_summary: (s.pattern_summary ?? []) as PatternEntry[],
    pii_detected: s.pii_detected,
    pii_type: s.pii_type as PIIType | null,
    outlier_count: s.outlier_count ?? 0,
    outlier_values: [], // not persisted — individual values omitted for privacy
    sample_values: [], // not persisted — raw data never leaves the browser
    detected_date_formats: null,
  };
}
