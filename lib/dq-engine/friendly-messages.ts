import type { RuleResult } from "@/types/dq.types";

function pct(n: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n !== 1 ? "s" : ""}`;
}

/**
 * Returns a plain-English failure sentence for a failing RuleResult.
 * Returns null when the rule passed (nothing to explain).
 * Column name is wrapped in **bold** markers — use renderFriendly() to render.
 */
export function getFriendlyMessage(r: RuleResult): string | null {
  if (r.status === "pass") return null;

  const col = r.column_name && r.column_name !== "__dataset__" ? r.column_name : null;
  const bold = col ? `**${col}**` : "This column";
  const n = r.failed_records;
  const total = r.total_records;
  const p = pct(n, total);

  switch (r.rule_type) {
    case "not_null":
      return `${bold} is missing ${p} of data (${plural(n, "record")} out of ${total} have no value)`;

    case "not_empty":
      return `${bold} has ${plural(n, "blank or empty value")} (out of ${total} records)`;

    case "mandatory_column":
      return col
        ? `Column **${col}** is required but has no data`
        : "A required column is missing data";

    case "conditional_not_null":
      return `${bold} has ${plural(n, "missing value")} where a related condition requires it to be present`;

    case "unique_column":
      return `${bold} has duplicate values — ${plural(n, "record")} share a value that should be unique`;

    case "duplicate_detection":
      return `${bold} has ${plural(n, "duplicate row")}`;

    case "regex_match":
      return `${bold} has ${plural(n, "value")} that don't look like the expected format`;

    case "enum_validation":
      return `${bold} has ${plural(n, "value")} that aren't in the allowed list`;

    case "datatype_check":
      return `${bold} has ${plural(n, "value")} that can't be read as the expected type`;

    case "datatype_enforcement":
      return `${bold} has ${plural(n, "value")} that don't match the expected data type`;

    case "range_check":
      return `${bold} has ${plural(n, "value")} outside the expected range`;

    case "positive_check":
      return `${bold} has ${plural(n, "negative or zero value")} (expected to be positive)`;

    case "cross_field_comparison":
      return `${bold} has ${plural(n, "row")} where a cross-field comparison is violated`;

    case "sequence_validation":
      return `${bold} has ${plural(n, "row")} where the date or value sequence is out of order`;

    case "format_check":
      return `${bold} has ${plural(n, "value")} not matching the expected format`;

    case "format_standardization":
      return `${bold} has ${plural(n, "value")} that deviate from the dominant format pattern`;

    case "case_consistency":
      return `${bold} has ${plural(n, "value")} that don't match the expected text casing`;

    case "cross_column_match":
      return `${bold} has ${plural(n, "row")} where the value doesn't match the reference column`;

    case "not_future_date":
      return `${bold} has ${plural(n, "date")} that appear to be in the future`;

    case "freshness_check":
      return `${bold} has ${plural(n, "date value")} older than the freshness requirement`;

    case "recent_update":
      return `${bold} has ${plural(n, "record")} that haven't been updated within the required time window`;

    case "decimal_places":
      return `${bold} has ${plural(n, "value")} with more decimal places than allowed`;

    case "rounding_check":
      return `${bold} has ${plural(n, "value")} that aren't rounded as required`;

    case "no_orphan_values":
    case "referential_integrity":
      return `${bold} has ${plural(n, "value")} that don't exist in the reference column`;

    default:
      return `${bold} has ${plural(n, "value")} that failed the ${r.rule_type.replace(/_/g, " ")} check`;
  }
}

/**
 * Splits a friendly message string into segments for React rendering.
 * Text wrapped in **...** becomes bold: true segments.
 */
export function renderFriendly(msg: string): { text: string; bold: boolean }[] {
  const parts = msg.split(/\*\*(.+?)\*\*/);
  return parts.map((text, i) => ({ text, bold: i % 2 === 1 }));
}
