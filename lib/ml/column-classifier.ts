/**
 * column-classifier.ts
 *
 * Three-layer heuristic column classifier — no external ML library required.
 *
 * Layer 1: Column name keywords (confidence 0.9)
 * Layer 2: Value pattern analysis from ColumnProfile (confidence 0.75)
 * Layer 3: Distribution signals — cardinality, null %, type (confidence 0.6)
 */

import type { ColumnProfile } from "@/types/profiling.types";

export type ColumnCategory =
  | "email"
  | "phone"
  | "date"
  | "datetime"
  | "id"
  | "name"
  | "amount"
  | "postal_code"
  | "boolean"
  | "categorical"
  | "numeric"
  | "free_text"
  | "unknown";

export interface ClassificationResult {
  category: ColumnCategory;
  confidence: number;
  signals: string[];
}

// ---- Layer 1: Name keyword dictionaries --------------------------------

const NAME_KEYWORDS: Record<ColumnCategory, string[]> = {
  email:       ["email", "e-mail", "mail", "emailaddress"],
  phone:       ["phone", "mobile", "tel", "cell", "fax", "contact_no", "phonenumber"],
  date:        ["date", "dob", "birthday", "created_at", "updated_at", "timestamp", "dt", "day"],
  datetime:    ["datetime", "created_at", "updated_at", "timestamp", "time"],
  id:          ["_id", "id", "uuid", "guid", "key", "code", "ref", "no", "num", "number", "identifier"],
  name:        ["name", "first_name", "last_name", "fullname", "surname", "given_name", "contact"],
  amount:      ["amount", "price", "cost", "fee", "salary", "income", "revenue", "total", "value", "balance"],
  postal_code: ["zip", "postcode", "postal", "pincode", "zipcode"],
  boolean:     ["is_", "has_", "flag", "active", "enabled", "status", "bool"],
  categorical: ["category", "type", "gender", "status", "level", "grade", "tier", "region", "country"],
  numeric:     ["count", "qty", "quantity", "age", "score", "rating", "rank", "index", "pct", "percent"],
  free_text:   ["description", "comment", "note", "remark", "reason", "message", "detail", "text", "body"],
  unknown:     [],
};

function classifyByName(colName: string): { category: ColumnCategory; confidence: number } | null {
  const lower = colName.toLowerCase().replace(/[\s\-]/g, "_");

  for (const [category, keywords] of Object.entries(NAME_KEYWORDS) as [ColumnCategory, string[]][]) {
    if (category === "unknown") continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const confidence = lower === kw || lower.startsWith(kw + "_") || lower.endsWith("_" + kw)
          ? 0.92
          : 0.85;
        return { category, confidence };
      }
    }
  }
  return null;
}

// ---- Layer 2: Profile-based signals ------------------------------------

function classifyByProfile(
  profile: ColumnProfile
): { category: ColumnCategory; confidence: number } | null {
  const t = profile.inferred_type;

  if (t === "email") return { category: "email", confidence: 0.9 };
  if (t === "phone") return { category: "phone", confidence: 0.85 };
  if (t === "datetime") return { category: "datetime", confidence: 0.88 };
  if (t === "date") return { category: "date", confidence: 0.88 };
  if (t === "uuid") return { category: "id", confidence: 0.9 };
  if (t === "boolean") return { category: "boolean", confidence: 0.9 };
  if (t === "url") return { category: "free_text", confidence: 0.6 };

  if (t === "integer" || t === "float") {
    if (profile.unique_pct > 90) return { category: "id", confidence: 0.72 };
    return { category: "numeric", confidence: 0.75 };
  }

  // String: check cardinality
  if (t === "string") {
    if (profile.unique_pct > 95 && profile.avg_length !== null && profile.avg_length > 20)
      return { category: "free_text", confidence: 0.65 };
    if (profile.unique_pct < 10 && (profile.top_values?.length ?? 0) <= 20)
      return { category: "categorical", confidence: 0.7 };
  }

  return null;
}

// ---- Layer 3: Distribution signals ------------------------------------

function classifyByDistribution(
  profile: ColumnProfile
): { category: ColumnCategory; confidence: number } | null {
  if (profile.null_pct > 80) {
    // Sparse but still attempt a weak classification by inferred_type
    if (profile.inferred_type === "integer" || profile.inferred_type === "float")
      return { category: "numeric", confidence: 0.4 };
    if (profile.inferred_type === "date" || profile.inferred_type === "datetime")
      return { category: profile.inferred_type, confidence: 0.4 };
    return null; // truly unknown — profileBasedSuggestions handles null-heavy rule
  }

  // Very high cardinality numeric → id
  if (
    (profile.inferred_type === "integer" || profile.inferred_type === "float") &&
    profile.unique_pct > 98
  ) {
    return { category: "id", confidence: 0.65 };
  }

  // Tiny value set → categorical / boolean
  if (profile.unique_count <= 2 && profile.row_count > 10)
    return { category: "boolean", confidence: 0.65 };
  if (profile.unique_count <= 10 && profile.unique_pct < 5)
    return { category: "categorical", confidence: 0.6 };

  return null;
}

// ---- Public API --------------------------------------------------------

export function classifyColumn(profile: ColumnProfile): ClassificationResult {
  const signals: string[] = [];

  const nameResult = classifyByName(profile.column_name);
  if (nameResult) signals.push(`name keyword (${nameResult.category}, ${nameResult.confidence})`);

  const profileResult = classifyByProfile(profile);
  if (profileResult) signals.push(`inferred type = ${profile.inferred_type} → ${profileResult.category}`);

  const distResult = classifyByDistribution(profile);
  if (distResult) signals.push(`distribution signal → ${distResult.category}`);

  // Pick highest-confidence result
  const candidates = [nameResult, profileResult, distResult].filter(Boolean) as {
    category: ColumnCategory;
    confidence: number;
  }[];

  if (candidates.length === 0) {
    return { category: "unknown", confidence: 0.3, signals };
  }

  candidates.sort((a, b) => b.confidence - a.confidence);
  return { category: candidates[0].category, confidence: candidates[0].confidence, signals };
}
