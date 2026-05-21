/**
 * rule-suggester.ts
 *
 * Maps ColumnCategory → DQRule suggestions.
 * No external API or TF.js required — pure heuristic decision table.
 */

import type { ColumnProfile } from "@/types/profiling.types";
import type { SuggestedRule } from "@/types/dq.types";
import { classifyColumn, type ColumnCategory } from "./column-classifier";

type RuleTemplate = Omit<SuggestedRule, "column_name" | "confidence" | "reason"> & {
  reason: string;
  confidence: number;
};

// ---- Decision table: category → rule templates -------------------------

const RULES_BY_CATEGORY: Record<ColumnCategory, RuleTemplate[]> = {
  email: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.95, reason: "Emails should be present",           confidence: 0.9 },
    { dimension: "validity",     rule_type: "regex_match", parameters: { pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" }, threshold: 0.95, reason: "Validate email format", confidence: 0.92 },
    { dimension: "uniqueness",   rule_type: "unique_column", parameters: {}, threshold: 0.95, reason: "Emails should be unique per record", confidence: 0.82 },
    { dimension: "conformity",   rule_type: "format_check", parameters: { template: "email" }, threshold: 0.95, reason: "Email format conformity",           confidence: 0.88 },
  ],
  phone: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.9,  reason: "Phone should be present",            confidence: 0.85 },
    { dimension: "validity",     rule_type: "regex_match", parameters: { pattern: "^[\\+]?[\\d\\s\\-\\.\\(\\)]{7,15}$" }, threshold: 0.9, reason: "Validate phone format", confidence: 0.85 },
    { dimension: "conformity",   rule_type: "format_check", parameters: { template: "phone" }, threshold: 0.9, reason: "Phone format conformity",            confidence: 0.82 },
  ],
  date: [
    { dimension: "completeness", rule_type: "not_null",       parameters: {}, threshold: 0.9,  reason: "Date should be present",             confidence: 0.85 },
    { dimension: "validity",     rule_type: "datatype_check", parameters: { expected_type: "date" }, threshold: 0.95, reason: "All values must be valid dates", confidence: 0.9 },
    { dimension: "timeliness",   rule_type: "not_future_date", parameters: {}, threshold: 0.99, reason: "Dates should not be in the future",  confidence: 0.75 },
    { dimension: "conformity",   rule_type: "format_check",   parameters: { template: "date_iso" }, threshold: 0.9, reason: "ISO date format (YYYY-MM-DD)",   confidence: 0.78 },
  ],
  datetime: [
    { dimension: "completeness", rule_type: "not_null",       parameters: {}, threshold: 0.9,  reason: "Datetime should be present",         confidence: 0.85 },
    { dimension: "validity",     rule_type: "datatype_check", parameters: { expected_type: "date" }, threshold: 0.95, reason: "All values must be valid datetimes", confidence: 0.9 },
    { dimension: "timeliness",   rule_type: "not_future_date", parameters: {}, threshold: 0.99, reason: "Timestamps should not be in the future", confidence: 0.72 },
    { dimension: "currency",     rule_type: "recent_update",  parameters: { max_age_days: 30 }, threshold: 0.8, reason: "Data should be updated within 30 days", confidence: 0.65 },
  ],
  id: [
    { dimension: "completeness", rule_type: "not_null",       parameters: {}, threshold: 1.0,  reason: "ID must never be null",              confidence: 0.95 },
    { dimension: "uniqueness",   rule_type: "unique_column",  parameters: {}, threshold: 1.0,  reason: "IDs must be unique",                 confidence: 0.95 },
    { dimension: "completeness", rule_type: "mandatory_column", parameters: {}, threshold: 1.0, reason: "ID column is mandatory",            confidence: 0.9  },
  ],
  name: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.9, reason: "Name should be present",               confidence: 0.88 },
    { dimension: "completeness", rule_type: "not_empty",   parameters: {}, threshold: 0.9, reason: "Name should not be empty",             confidence: 0.85 },
    { dimension: "consistency",  rule_type: "case_consistency", parameters: { case: "title" }, threshold: 0.8, reason: "Names should be title-cased",  confidence: 0.65 },
  ],
  amount: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.95, reason: "Amount should be present",            confidence: 0.88 },
    { dimension: "accuracy",     rule_type: "positive_check", parameters: {}, threshold: 0.95, reason: "Amounts should be positive",       confidence: 0.82 },
    { dimension: "precision",    rule_type: "decimal_places", parameters: { max_decimals: 2 }, threshold: 0.95, reason: "Currency amounts need 2 decimal places", confidence: 0.8 },
    { dimension: "conformity",   rule_type: "datatype_enforcement", parameters: { expected_type: "numeric" }, threshold: 0.99, reason: "Amount must be numeric", confidence: 0.9 },
  ],
  postal_code: [
    { dimension: "validity",   rule_type: "regex_match", parameters: { pattern: "^\\d{5}(-\\d{4})?$|^\\d{6}$" }, threshold: 0.9, reason: "Validate postal code format", confidence: 0.8 },
    { dimension: "conformity", rule_type: "format_check", parameters: { template: "postal_code_us" }, threshold: 0.9, reason: "US postal code format", confidence: 0.75 },
  ],
  boolean: [
    { dimension: "completeness", rule_type: "not_null", parameters: {}, threshold: 0.9, reason: "Boolean flag should be present", confidence: 0.82 },
  ],
  categorical: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.9, reason: "Category should be present",           confidence: 0.82 },
    { dimension: "consistency",  rule_type: "case_consistency", parameters: { case: "lower" }, threshold: 0.9, reason: "Categories should be consistently cased", confidence: 0.7 },
  ],
  numeric: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.9,  reason: "Numeric value should be present",     confidence: 0.8  },
    { dimension: "conformity",   rule_type: "datatype_enforcement", parameters: { expected_type: "numeric" }, threshold: 0.99, reason: "Column should contain only numbers", confidence: 0.88 },
    { dimension: "accuracy",     rule_type: "positive_check", parameters: {}, threshold: 0.9, reason: "Numeric values should be positive", confidence: 0.65 },
  ],
  free_text: [
    { dimension: "completeness", rule_type: "not_empty",   parameters: {}, threshold: 0.8, reason: "Text field should not be empty",       confidence: 0.72 },
  ],
  unknown: [
    { dimension: "completeness", rule_type: "not_null",    parameters: {}, threshold: 0.9, reason: "Column should not be null",            confidence: 0.6  },
  ],
};

// ---- Additional rule suggestions based on profile stats ----------------

function profileBasedSuggestions(profile: ColumnProfile): RuleTemplate[] {
  const extra: RuleTemplate[] = [];

  // A — PII columns: enforce 100% completeness
  if (profile.pii_detected) {
    extra.push(
      {
        dimension: "completeness",
        rule_type: "mandatory_column",
        parameters: {},
        threshold: 1.0,
        reason: `PII column (${profile.pii_type ?? "detected"}) must always be present or entirely absent`,
        confidence: 0.92,
      },
      {
        dimension: "completeness",
        rule_type: "not_null",
        parameters: {},
        threshold: 1.0,
        reason: `PII column (${profile.pii_type ?? "detected"}) — completeness enforced at 100%`,
        confidence: 0.92,
      }
    );
  }

  // B — Date format-specific format_check using profiler-detected format
  if (profile.detected_date_formats && profile.detected_date_formats.length > 0) {
    const best = profile.detected_date_formats.find(
      (f) => f.confidence >= 0.7 && f.matchPct >= 90
    );
    if (best && best.templateKey !== "date_iso") {
      extra.push({
        dimension: "conformity",
        rule_type: "format_check",
        parameters: { template: best.templateKey },
        threshold: 0.9,
        reason: `Detected date format: ${best.format} (${best.matchPct}% match, ${Math.round(best.confidence * 100)}% confidence)`,
        confidence: Math.min(0.95, best.confidence),
      });
    }
  }

  // C — Enum validation from actual top_values (non-PII, ≤20 unique values)
  if (
    !profile.pii_detected &&
    profile.unique_count <= 20 &&
    profile.null_pct < 80 &&
    profile.top_values.length > 0
  ) {
    extra.push({
      dimension: "validity",
      rule_type: "enum_validation",
      parameters: { allowed_values: profile.top_values.map((v) => v.value) },
      threshold: 0.99,
      reason: `${profile.unique_count} distinct values observed — auto-generated allowed set`,
      confidence: profile.unique_count <= 5 ? 0.85 : 0.75,
    });
  }

  // D — Pattern-based format_standardization when one pattern dominates (≥95%)
  if (profile.pattern_summary.length > 0 && profile.pattern_summary[0].pct >= 95) {
    extra.push({
      dimension: "consistency",
      rule_type: "format_standardization",
      parameters: {},
      threshold: 0.95,
      reason: `Pattern "${profile.pattern_summary[0].pattern}" covers ${profile.pattern_summary[0].pct}% of values — standardization recommended`,
      confidence: 0.78,
    });
  }

  // E — σ-based range_check for numeric columns with outliers (replaces ±50% heuristic)
  if (
    (profile.inferred_type === "integer" || profile.inferred_type === "float") &&
    profile.outlier_count > 0 &&
    profile.min_value !== null &&
    profile.max_value !== null
  ) {
    const useStdDev =
      profile.avg_value !== null &&
      profile.std_dev !== null &&
      profile.std_dev > 0;
    const min = useStdDev
      ? profile.avg_value! - 3 * profile.std_dev!
      : parseFloat(profile.min_value) * 0.5;
    const max = useStdDev
      ? profile.avg_value! + 3 * profile.std_dev!
      : parseFloat(profile.max_value) * 1.5;
    extra.push({
      dimension: "accuracy",
      rule_type: "range_check",
      parameters: { min: Math.round(min * 1000) / 1000, max: Math.round(max * 1000) / 1000 },
      threshold: 0.95,
      reason: useStdDev
        ? `${profile.outlier_count} outlier(s) detected — range bounded by μ±3σ [${min.toFixed(2)}–${max.toFixed(2)}]`
        : `${profile.outlier_count} outlier(s) detected — range check recommended`,
      confidence: useStdDev ? 0.80 : 0.72,
    });
  }

  // F — Null-heavy columns (>80% null) get a realistic completeness rule
  if (profile.null_pct > 80) {
    extra.push({
      dimension: "completeness",
      rule_type: "not_null",
      parameters: {},
      threshold: Math.max(0.1, (100 - profile.null_pct) / 100),
      reason: `Column is ${profile.null_pct.toFixed(0)}% null — completeness rule with realistic threshold`,
      confidence: 0.7,
    });
  }

  // G — Boolean enum from actual observed values (replaces hardcoded 8-value list)
  if (
    (profile.inferred_type === "boolean" || profile.unique_count <= 2) &&
    !profile.pii_detected &&
    profile.top_values.length > 0
  ) {
    const enumValues = profile.top_values.map((v) => v.value);
    extra.push({
      dimension: "validity",
      rule_type: "enum_validation",
      parameters: { allowed_values: enumValues },
      threshold: 0.99,
      reason: `Boolean column — allowed values from data: [${enumValues.slice(0, 4).join(", ")}]`,
      confidence: 0.88,
    });
  }

  // High null rate (20–80%) → suggest lower threshold
  if (profile.null_pct > 20 && profile.null_pct <= 80) {
    extra.push({
      dimension: "completeness",
      rule_type: "not_null",
      parameters: {},
      threshold: Math.max(0.5, (100 - profile.null_pct) / 100 - 0.05),
      reason: `Column has ${profile.null_pct}% nulls — threshold adjusted to data reality`,
      confidence: 0.75,
    });
  }

  return extra;
}

// ---- Public API --------------------------------------------------------

export function suggestRules(profiles: ColumnProfile[]): SuggestedRule[] {
  const suggestions: SuggestedRule[] = [];
  const seen = new Set<string>(); // deduplicate by col+dim+rule_type

  for (const profile of profiles) {
    const { category, confidence: classConf } = classifyColumn(profile);
    const templates = RULES_BY_CATEGORY[category] ?? [];
    const extras = profileBasedSuggestions(profile);

    for (const tpl of [...extras, ...templates]) {
      const key = `${profile.column_name}|${tpl.dimension}|${tpl.rule_type}`;
      if (seen.has(key)) continue;
      seen.add(key);

      suggestions.push({
        column_name: profile.column_name,
        dimension: tpl.dimension,
        rule_type: tpl.rule_type,
        parameters: tpl.parameters,
        threshold: tpl.threshold,
        reason: tpl.reason,
        confidence: Math.min(1, tpl.confidence * classConf + (1 - tpl.confidence * classConf) * 0.1),
      });
    }
  }

  // Sort: highest confidence first
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
