import type { SuggestedRule } from "@/types/dq.types";
import type { DQDimension } from "@/types/app.types";

// ── Parameter extractors ────────────────────────────────────────────────────

function extractMinMax(d: string): { min: number; max: number } | null {
  const m =
    d.match(/between\s+(-?[\d.]+)\s+and\s+(-?[\d.]+)/) ||
    d.match(/(-?[\d.]+)\s+(?:to|-)\s+(-?[\d.]+)/) ||
    d.match(/min(?:imum)?\s*:?\s*(-?[\d.]+).*?max(?:imum)?\s*:?\s*(-?[\d.]+)/);
  if (!m) return null;
  return { min: parseFloat(m[1]), max: parseFloat(m[2]) };
}

function extractDays(d: string, fallback = 30): number {
  const m = d.match(/(\d+)\s*days?/);
  return m ? parseInt(m[1], 10) : fallback;
}

function extractDecimals(d: string): number | null {
  const m =
    d.match(/(\d+)\s*decimal/) ||
    d.match(/decimal.*?(\d+)/) ||
    d.match(/(\d+)\s*dp/);
  return m ? parseInt(m[1], 10) : null;
}

function extractEnumValues(d: string): string[] | null {
  // Look for values after a colon or "one of" / "either" / "only"
  const afterColon = d.match(/(?:one of|allowed values?|values?|either|only)\s*:?\s*(.+)$/i);
  const source = afterColon ? afterColon[1] : null;
  if (!source) return null;
  const values = source
    .split(/\s*(?:,|or|\|)\s*/)
    .map((v) => v.replace(/^["'\s]+|["'\s]+$/g, "").trim())
    .filter(Boolean);
  return values.length >= 2 ? values : null;
}

function extractRegexPattern(d: string): string | null {
  const m = d.match(/["']([^"']{3,})["']/) || d.match(/pattern[:\s]+(\S+)/);
  return m ? m[1] : null;
}

// ── Confidence boost based on inferred column type ─────────────────────────

const TYPE_BOOST: Record<string, string[]> = {
  email:    ["email", "e-mail"],
  phone:    ["phone", "telephone", "mobile"],
  url:      ["url", "website", "link"],
  uuid:     ["uuid", "guid"],
  date:     ["date", "dob", "birthday"],
  datetime: ["datetime", "timestamp"],
  integer:  ["integer", "whole number"],
  float:    ["numeric", "decimal", "float"],
};

function typeBoost(inferredType: string, d: string): number {
  const keywords = TYPE_BOOST[inferredType] ?? [];
  return keywords.some((k) => d.includes(k)) ? 0.03 : 0;
}

// ── Matcher type ────────────────────────────────────────────────────────────

interface MatchResult {
  dimension: DQDimension;
  rule_type: string;
  parameters: Record<string, unknown>;
  threshold: number;
  reason: string;
  base_confidence: number;
}

// ── Core match function ─────────────────────────────────────────────────────

function match(d: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some((p) =>
    typeof p === "string" ? d.includes(p) : p.test(d)
  );
}

// ── Ordered matchers ────────────────────────────────────────────────────────

function runMatchers(d: string, columnName: string, inferredType: string): MatchResult[] {
  const results: MatchResult[] = [];

  // not_null (broad — must be blank/null/required/missing)
  if (
    match(d, [
      "not null", "not be null", "never null",
      "not blank", "not be blank", "never blank",
      "required", "must have", "must be filled",
      "must be provided", "cannot be empty",
      /\bnot\s+missing\b/, "must exist", "mandatory",
    ])
  ) {
    results.push({
      dimension: "completeness", rule_type: "not_null",
      parameters: {}, threshold: 0.99,
      reason: `${columnName} is a required field — nulls are not acceptable`,
      base_confidence: 0.97,
    });
  }

  // not_empty (explicitly about empty strings)
  if (
    match(d, [
      "not empty", "not be empty", "never empty",
      "no empty string", "populated", "non-empty", "non empty",
    ])
  ) {
    results.push({
      dimension: "completeness", rule_type: "not_empty",
      parameters: {}, threshold: 0.97,
      reason: `${columnName} must not contain empty strings`,
      base_confidence: 0.93,
    });
  }

  // unique_column
  if (
    match(d, [
      "unique", "no duplicate", "no duplicates", "distinct",
      "one per", "no repeat", "must be unique", "uniqueness",
      /\beach\s+value\s+(?:must\s+)?appear\s+once\b/,
    ])
  ) {
    results.push({
      dimension: "uniqueness", rule_type: "unique_column",
      parameters: {}, threshold: 0.99,
      reason: `${columnName} must have unique values — no duplicates allowed`,
      base_confidence: 0.95,
    });
  }

  // format_check — email
  if (match(d, ["email", "e-mail", "email format", "email address", "valid email"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "email" }, threshold: 0.95,
      reason: `${columnName} must match a valid email address format`,
      base_confidence: 0.96,
    });
  }

  // format_check — phone
  if (
    match(d, [
      "phone", "telephone", "mobile number", "phone number",
      "phone format", "us phone", "valid phone", "cell number",
    ])
  ) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "phone" }, threshold: 0.95,
      reason: `${columnName} must match a valid phone number format`,
      base_confidence: 0.95,
    });
  }

  // format_check — url
  if (match(d, ["url", "website", "web address", "link", "http", "https", "valid url"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "url" }, threshold: 0.95,
      reason: `${columnName} must be a valid URL`,
      base_confidence: 0.94,
    });
  }

  // format_check — uuid
  if (match(d, ["uuid", "guid", "unique identifier", "universal unique"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "uuid" }, threshold: 0.99,
      reason: `${columnName} must follow UUID format`,
      base_confidence: 0.95,
    });
  }

  // format_check — postal code
  if (match(d, ["zip code", "zipcode", "postal code", "postcode", "post code", "pincode"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "postal_code_us" }, threshold: 0.95,
      reason: `${columnName} must be a valid US postal code`,
      base_confidence: 0.90,
    });
  }

  // format_check — SSN
  if (match(d, ["ssn", "social security", "social security number"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "ssn" }, threshold: 0.99,
      reason: `${columnName} must follow SSN format (XXX-XX-XXXX)`,
      base_confidence: 0.93,
    });
  }

  // format_check — credit card
  if (match(d, ["credit card", "card number", "creditcard"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "credit_card" }, threshold: 0.99,
      reason: `${columnName} must be a valid credit card number`,
      base_confidence: 0.92,
    });
  }

  // format_check — ISO date
  if (match(d, ["iso date", "yyyy-mm-dd", "date iso", "iso 8601", "iso format"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "date_iso" }, threshold: 0.95,
      reason: `${columnName} must follow ISO date format (YYYY-MM-DD)`,
      base_confidence: 0.94,
    });
  }

  // format_check — US date
  if (match(d, ["us date", "mm/dd/yyyy", "american date", "us format date"])) {
    results.push({
      dimension: "conformity", rule_type: "format_check",
      parameters: { template: "date_us" }, threshold: 0.95,
      reason: `${columnName} must follow US date format (MM/DD/YYYY)`,
      base_confidence: 0.91,
    });
  }

  // positive_check
  if (
    match(d, [
      "positive", "greater than zero", "> 0", "above zero",
      "no negative", "must be positive", "non-negative",
      /\bpositive\s+number\b/, /\bgreater\s+than\s+0\b/,
    ])
  ) {
    results.push({
      dimension: "accuracy", rule_type: "positive_check",
      parameters: {}, threshold: 0.99,
      reason: `${columnName} must be a positive value`,
      base_confidence: 0.94,
    });
  }

  // range_check
  const minMax = extractMinMax(d);
  if (minMax && match(d, ["between", "range", "from", "min", "max", "to"])) {
    results.push({
      dimension: "accuracy", rule_type: "range_check",
      parameters: minMax, threshold: 0.95,
      reason: `${columnName} must be between ${minMax.min} and ${minMax.max}`,
      base_confidence: 0.92,
    });
  }

  // enum_validation
  const enumValues = extractEnumValues(d);
  if (
    enumValues &&
    match(d, [
      "one of", "allowed values", "allowed value",
      "must be", "either", "only", "valid values",
    ])
  ) {
    results.push({
      dimension: "validity", rule_type: "enum_validation",
      parameters: { allowed_values: enumValues }, threshold: 0.99,
      reason: `${columnName} must be one of: ${enumValues.join(", ")}`,
      base_confidence: 0.92,
    });
  }

  // case_consistency — uppercase
  if (match(d, ["uppercase", "upper case", "all caps", "all uppercase", "must be upper"])) {
    results.push({
      dimension: "consistency", rule_type: "case_consistency",
      parameters: { case: "upper" }, threshold: 0.95,
      reason: `${columnName} must be consistently uppercase`,
      base_confidence: 0.91,
    });
  }

  // case_consistency — lowercase
  if (match(d, ["lowercase", "lower case", "all lowercase", "must be lower"])) {
    results.push({
      dimension: "consistency", rule_type: "case_consistency",
      parameters: { case: "lower" }, threshold: 0.95,
      reason: `${columnName} must be consistently lowercase`,
      base_confidence: 0.91,
    });
  }

  // case_consistency — title case
  if (match(d, ["title case", "proper case", "capitalize", "capitalised", "title-case"])) {
    results.push({
      dimension: "consistency", rule_type: "case_consistency",
      parameters: { case: "title" }, threshold: 0.95,
      reason: `${columnName} must be in title case`,
      base_confidence: 0.90,
    });
  }

  // decimal_places
  const decimals = extractDecimals(d);
  if (decimals !== null && match(d, ["decimal", "dp", "decimal place", "decimal point"])) {
    results.push({
      dimension: "precision", rule_type: "decimal_places",
      parameters: { max_decimals: decimals }, threshold: 0.99,
      reason: `${columnName} must have at most ${decimals} decimal place${decimals !== 1 ? "s" : ""}`,
      base_confidence: 0.92,
    });
  }

  // not_future_date
  if (
    match(d, [
      "not future", "no future", "past date", "cannot be future",
      "must not be future", "not in the future", "historical",
      /\bno\s+future\s+date\b/, /\bpast\s+only\b/,
    ])
  ) {
    results.push({
      dimension: "timeliness", rule_type: "not_future_date",
      parameters: {}, threshold: 0.99,
      reason: `${columnName} must not be a future date`,
      base_confidence: 0.94,
    });
  }

  // freshness_check
  if (
    match(d, [
      "recent", "fresh", "not stale", "not old", "up to date",
      "within days", "last days", "updated recently",
      /\bwithin\s+\d+\s+days?\b/, /\blast\s+\d+\s+days?\b/,
    ])
  ) {
    const days = extractDays(d);
    results.push({
      dimension: "currency", rule_type: "freshness_check",
      parameters: { max_age_days: days }, threshold: 0.95,
      reason: `${columnName} must be dated within the last ${days} days`,
      base_confidence: 0.89,
    });
  }

  // datatype_enforcement — integer
  if (
    match(d, [
      "integer", "whole number", "no decimal", "no decimals",
      "no fraction", "must be integer", "must be whole",
    ])
  ) {
    results.push({
      dimension: "conformity", rule_type: "datatype_enforcement",
      parameters: { expected_type: "integer" }, threshold: 0.99,
      reason: `${columnName} must be a whole integer (no decimals)`,
      base_confidence: 0.91,
    });
  }

  // datatype_enforcement — numeric
  if (
    match(d, [
      "numeric", "must be a number", "must be number",
      "is a number", "must be numeric", "number only",
    ]) &&
    !match(d, ["integer", "whole number"]) // avoid double-firing with integer
  ) {
    results.push({
      dimension: "conformity", rule_type: "datatype_enforcement",
      parameters: { expected_type: "numeric" }, threshold: 0.99,
      reason: `${columnName} must be a numeric value`,
      base_confidence: 0.90,
    });
  }

  // regex_match
  const pattern = extractRegexPattern(d);
  if (pattern && match(d, ["pattern", "regex", "must match", "matches", "format"])) {
    results.push({
      dimension: "validity", rule_type: "regex_match",
      parameters: { pattern }, threshold: 0.95,
      reason: `${columnName} must match the pattern: ${pattern}`,
      base_confidence: 0.88,
    });
  }

  // mandatory_column — fallback if nothing else matched null intent
  const hasNullRule = results.some((r) =>
    ["not_null", "not_empty", "mandatory_column"].includes(r.rule_type)
  );
  if (
    !hasNullRule &&
    match(d, ["mandatory", "required field", "must exist", "compulsory", "obligatory"])
  ) {
    results.push({
      dimension: "completeness", rule_type: "mandatory_column",
      parameters: {}, threshold: 0.99,
      reason: `${columnName} is a mandatory field`,
      base_confidence: 0.85,
    });
  }

  return results;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Parse plain-English rule descriptions into SuggestedRule objects.
 * Runs entirely in the browser — no API calls, no external dependencies.
 *
 * @param description  User's plain-English text (e.g. "must not be blank and must be valid email")
 * @param columnName   Column being validated
 * @param inferredType Inferred data type from the profiler (boosts confidence for matching types)
 */
export function parseRulesFromDescription(
  description: string,
  columnName: string,
  inferredType: string
): SuggestedRule[] {
  const d = description.toLowerCase().trim();
  if (!d) return [];

  const boost = typeBoost(inferredType, d);
  const matches = runMatchers(d, columnName, inferredType);

  // Deduplicate by rule_type (keep highest confidence)
  const seen = new Map<string, MatchResult>();
  for (const m of matches) {
    const existing = seen.get(m.rule_type);
    if (!existing || m.base_confidence > existing.base_confidence) {
      seen.set(m.rule_type, m);
    }
  }

  return Array.from(seen.values())
    .map((m) => ({
      column_name: columnName,
      dimension: m.dimension,
      rule_type: m.rule_type,
      parameters: m.parameters,
      threshold: m.threshold,
      reason: m.reason,
      confidence: Math.min(0.99, m.base_confidence + boost),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
