import type { InferredType, DetectedDateFormat, DateFormatKey, DateFormatAmbiguity } from "@/types/profiling.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\+]?[\d\s\-\(\)\.]{7,15}$/;
const URL_RE = /^https?:\/\/.+/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INTEGER_RE = /^-?\d+$/;
const FLOAT_RE = /^-?\d+(\.\d+)?$/;
const BOOL_VALUES = new Set(["true", "false", "yes", "no", "y", "n", "1", "0", "t", "f"]);

// Date patterns: ISO, US (MM/DD/YYYY), EU (DD.MM.YYYY), etc.
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{2}\.\d{2}\.\d{4}$/,
  /^\d{4}\/\d{2}\/\d{2}$/,
];
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}/;

function hitRate(values: string[], test: (v: string) => boolean): number {
  if (values.length === 0) return 0;
  return values.filter(test).length / values.length;
}

function isDateLike(v: string): boolean {
  return DATE_PATTERNS.some((r) => r.test(v)) && !isNaN(Date.parse(v));
}

function isDatetimeLike(v: string): boolean {
  return DATETIME_RE.test(v) && !isNaN(Date.parse(v));
}

// ---- Date Format Detection ------------------------------------------------

interface DateFormatCandidate {
  format: DateFormatKey;
  templateKey: string;
  regex: RegExp;
  extractFirst: (s: string) => number;  // potential day or month
  extractSecond: (s: string) => number; // potential month or day
  isPaired: boolean;    // true if shares regex with a mirror format (DD vs MM ambiguity)
  isDayFirst: boolean;  // for paired: true = this is the DD-MM variant
  isUnambiguous: boolean;
}

const DATE_FORMAT_CANDIDATES: DateFormatCandidate[] = [
  // --- Unambiguous formats ---
  {
    format: "YYYY-MM-DD", templateKey: "date_iso",
    regex: /^\d{4}-\d{2}-\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(5, 7), 10),  // month
    extractSecond: (s) => parseInt(s.slice(8, 10), 10), // day
    isPaired: false, isDayFirst: false, isUnambiguous: true,
  },
  {
    format: "YYYY/MM/DD", templateKey: "date_ymd_slash",
    regex: /^\d{4}\/\d{2}\/\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(5, 7), 10),
    extractSecond: (s) => parseInt(s.slice(8, 10), 10),
    isPaired: false, isDayFirst: false, isUnambiguous: true,
  },
  {
    format: "DD.MM.YYYY", templateKey: "date_eu",
    regex: /^\d{2}\.\d{2}\.\d{4}$/,
    extractFirst:  (s) => parseInt(s.slice(0, 2), 10),  // day
    extractSecond: (s) => parseInt(s.slice(3, 5), 10),  // month
    isPaired: false, isDayFirst: true, isUnambiguous: true,
  },
  {
    format: "YYYYMMDD", templateKey: "date_compact",
    regex: /^\d{8}$/,
    extractFirst:  (s) => parseInt(s.slice(4, 6), 10),  // month
    extractSecond: (s) => parseInt(s.slice(6, 8), 10),  // day
    isPaired: false, isDayFirst: false, isUnambiguous: true,
  },
  // --- Paired: DD-MM-YYYY vs MM-DD-YYYY ---
  {
    format: "DD-MM-YYYY", templateKey: "date_dmy_dash",
    regex: /^\d{2}-\d{2}-\d{4}$/,
    extractFirst:  (s) => parseInt(s.slice(0, 2), 10),  // potential day
    extractSecond: (s) => parseInt(s.slice(3, 5), 10),  // potential month
    isPaired: true, isDayFirst: true, isUnambiguous: false,
  },
  {
    format: "MM-DD-YYYY", templateKey: "date_dmy_dash",
    regex: /^\d{2}-\d{2}-\d{4}$/,
    extractFirst:  (s) => parseInt(s.slice(3, 5), 10),  // potential day
    extractSecond: (s) => parseInt(s.slice(0, 2), 10),  // potential month
    isPaired: true, isDayFirst: false, isUnambiguous: false,
  },
  // --- Paired: DD/MM/YYYY vs MM/DD/YYYY ---
  {
    format: "DD/MM/YYYY", templateKey: "date_dmy_slash",
    regex: /^\d{2}\/\d{2}\/\d{4}$/,
    extractFirst:  (s) => parseInt(s.slice(0, 2), 10),
    extractSecond: (s) => parseInt(s.slice(3, 5), 10),
    isPaired: true, isDayFirst: true, isUnambiguous: false,
  },
  {
    format: "MM/DD/YYYY", templateKey: "date_us",
    regex: /^\d{2}\/\d{2}\/\d{4}$/,
    extractFirst:  (s) => parseInt(s.slice(3, 5), 10),
    extractSecond: (s) => parseInt(s.slice(0, 2), 10),
    isPaired: true, isDayFirst: false, isUnambiguous: false,
  },
  // --- Paired: DD-MM-YY vs MM-DD-YY ---
  {
    format: "DD-MM-YY", templateKey: "date_dmy_dash_yy",
    regex: /^\d{2}-\d{2}-\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(0, 2), 10),
    extractSecond: (s) => parseInt(s.slice(3, 5), 10),
    isPaired: true, isDayFirst: true, isUnambiguous: false,
  },
  {
    format: "MM-DD-YY", templateKey: "date_dmy_dash_yy",
    regex: /^\d{2}-\d{2}-\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(3, 5), 10),
    extractSecond: (s) => parseInt(s.slice(0, 2), 10),
    isPaired: true, isDayFirst: false, isUnambiguous: false,
  },
  // --- Paired: DD/MM/YY vs MM/DD/YY ---
  {
    format: "DD/MM/YY", templateKey: "date_dmy_slash_yy",
    regex: /^\d{2}\/\d{2}\/\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(0, 2), 10),
    extractSecond: (s) => parseInt(s.slice(3, 5), 10),
    isPaired: true, isDayFirst: true, isUnambiguous: false,
  },
  {
    format: "MM/DD/YY", templateKey: "date_dmy_slash_yy",
    regex: /^\d{2}\/\d{2}\/\d{2}$/,
    extractFirst:  (s) => parseInt(s.slice(3, 5), 10),
    extractSecond: (s) => parseInt(s.slice(0, 2), 10),
    isPaired: true, isDayFirst: false, isUnambiguous: false,
  },
];

/**
 * Detect which date format(s) a column's values actually use.
 * Uses statistical disambiguation: if any day-position value > 12, the format is confirmed.
 * Returns results sorted by confidence descending.
 */
export function detectDateFormats(values: string[]): DetectedDateFormat[] {
  const sample = values.filter((v) => v !== null && v.trim() !== "").slice(0, 500);
  if (sample.length === 0) return [];

  const results: DetectedDateFormat[] = [];

  for (const candidate of DATE_FORMAT_CANDIDATES) {
    const matches = sample.filter((v) => candidate.regex.test(v.trim()));
    const matchPct = Math.round((matches.length / sample.length) * 10000) / 100;

    // Skip noise (< 5% match rate)
    if (matchPct < 5) continue;

    let confidence: number;
    let ambiguity: DateFormatAmbiguity;

    if (candidate.isUnambiguous) {
      confidence = matchPct / 100;
      ambiguity = candidate.isDayFirst ? "day_first" : "unambiguous";
    } else {
      // Disambiguation: check if any first-position value > 12 (confirms day-first)
      const hasFirstAbove12 = matches.some((v) => candidate.extractFirst(v) > 12);
      const hasSecondAbove12 = matches.some((v) => candidate.extractSecond(v) > 12);

      if (candidate.isDayFirst) {
        // This variant claims day is in position 1
        if (hasSecondAbove12) continue; // confirmed month-first → skip day-first variant
        if (hasFirstAbove12) {
          ambiguity = "day_first";
          confidence = (matchPct / 100) * 0.95;
        } else {
          ambiguity = "ambiguous";
          confidence = (matchPct / 100) * 0.60;
        }
      } else {
        // This variant claims month is in position 1
        if (hasFirstAbove12) continue; // confirmed day-first → skip month-first variant
        if (hasSecondAbove12) {
          ambiguity = "month_first";
          confidence = (matchPct / 100) * 0.95;
        } else {
          ambiguity = "ambiguous";
          confidence = (matchPct / 100) * 0.60;
        }
      }
    }

    results.push({
      format: candidate.format,
      templateKey: candidate.templateKey,
      matchCount: matches.length,
      matchPct,
      confidence: Math.round(confidence * 1000) / 1000,
      ambiguity,
      exampleValues: matches.slice(0, 3),
    });
  }

  // Deduplicate ambiguous pairs: if both DD/MM and MM/DD survived with "ambiguous",
  // keep only the day-first variant to avoid confusing users with two identical entries.
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    if (r.ambiguity !== "ambiguous") return true;
    // Group paired ambiguous by templateKey — keep only first encountered (day-first comes first)
    if (seen.has(r.templateKey)) return false;
    seen.add(r.templateKey);
    return true;
  });

  return deduped.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Infer the most likely semantic type of a column given a sample of non-null string values.
 * Uses hit-rate thresholds: 95% for strict types, 80% for looser ones.
 */
export function inferColumnType(nonNullValues: string[]): InferredType {
  if (nonNullValues.length === 0) return "string";

  const sample = nonNullValues.slice(0, 500);

  // Datetime before date (more specific)
  if (hitRate(sample, isDatetimeLike) >= 0.9) return "datetime";
  if (hitRate(sample, isDateLike) >= 0.9) return "date";

  // Email / phone / url / uuid before generic string
  if (hitRate(sample, (v) => EMAIL_RE.test(v)) >= 0.8) return "email";
  if (hitRate(sample, (v) => PHONE_RE.test(v)) >= 0.8) return "phone";
  if (hitRate(sample, (v) => URL_RE.test(v)) >= 0.9) return "url";
  if (hitRate(sample, (v) => UUID_RE.test(v)) >= 0.95) return "uuid";

  // Boolean
  if (hitRate(sample, (v) => BOOL_VALUES.has(v.toLowerCase())) >= 0.95) return "boolean";

  // Numeric — check float first then integer
  const numericRate = hitRate(sample, (v) => FLOAT_RE.test(v.replace(/,/g, "")));
  if (numericRate >= 0.95) {
    const intRate = hitRate(sample, (v) => INTEGER_RE.test(v.replace(/,/g, "")));
    return intRate >= 0.95 ? "integer" : "float";
  }

  // Mixed if many types coexist
  const typeSet = new Set<string>();
  for (const v of sample.slice(0, 100)) {
    if (INTEGER_RE.test(v)) typeSet.add("int");
    else if (FLOAT_RE.test(v)) typeSet.add("float");
    else if (EMAIL_RE.test(v)) typeSet.add("email");
    else if (isDateLike(v)) typeSet.add("date");
    else typeSet.add("string");
  }
  if (typeSet.size >= 3) return "mixed";

  return "string";
}
