/**
 * dq-rule-meta.ts
 *
 * Shared rule-type metadata used by both the manual rule builder and the
 * AI suggestion panel, so a suggested rule's parameters can be edited with
 * the exact same inputs a user would get building it from scratch.
 */

// rule_type → ordered list of parameter keys it requires
export const RULE_TYPE_PARAMS: Record<string, string[]> = {
  conditional_not_null: ["if_column", "if_value"],
  regex_match: ["pattern"],
  enum_validation: ["allowed_values"],
  datatype_check: ["expected_type"],
  sequence_validation: ["reference_column"],
  range_check: ["min", "max"],
  cross_field_comparison: ["reference_column", "operator"],
  case_consistency: ["case"],
  cross_column_match: ["reference_column"],
  no_orphan_values: ["reference_column"],
  referential_integrity: ["reference_column"],
  freshness_check: ["max_age_days"],
  recent_update: ["max_age_days"],
  not_stale: ["max_age_days"],
  format_check: ["template"],
  datatype_enforcement: ["expected_type"],
  decimal_places: ["max_decimals"],
  rounding_check: ["decimals"],
};

// Params that should render as a column picker rather than free text
export const COLUMN_PARAMS = new Set(["reference_column", "if_column"]);

export const THRESHOLD_PRESETS = [
  { key: "strict", value: "99", label: "Strict", hint: "IDs & keys" },
  { key: "standard", value: "95", label: "Standard", hint: "most rules" },
  { key: "lenient", value: "80", label: "Lenient", hint: "optional fields" },
  { key: "custom", value: null, label: "Custom", hint: "" },
] as const;

export type ThresholdMode = (typeof THRESHOLD_PRESETS)[number]["key"];

export function thresholdModeForPct(pct: string): ThresholdMode {
  const preset = THRESHOLD_PRESETS.find((p) => p.value === pct);
  return preset ? preset.key : "custom";
}

export function paramHint(param: string): string {
  const hints: Record<string, string> = {
    pattern: "e.g. ^\\d{4}-\\d{2}-\\d{2}$",
    allowed_values: "comma-separated: yes,no,maybe",
    expected_type: "date, numeric, boolean",
    min: "e.g. 0",
    max: "e.g. 1000000",
    max_age_days: "e.g. 30",
    decimals: "e.g. 2",
    max_decimals: "e.g. 2",
    case: "upper, lower, or title",
    reference_column: "column name in this dataset",
    if_column: "condition column name",
    if_value: "condition value",
    operator: ">= , <= , == , > , <",
    template: "email, phone, date_iso, uuid…",
  };
  return hints[param] ?? param;
}

// Stringify a suggested rule's parameter value for use as an editable input default
export function paramValueToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}

// Parse an edited param string back into the typed value createRule expects
export function parseParamValue(param: string, raw: string): unknown {
  if (param === "allowed_values") {
    return raw.split(",").map((v) => v.trim()).filter(Boolean);
  }
  const num = Number(raw);
  return !isNaN(num) && raw.trim() !== "" ? num : raw;
}
