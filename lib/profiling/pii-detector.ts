import type { PIIType } from "@/types/profiling.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\+]?[\d\s\-\.\(\)]{7,15}$/;
const SSN_RE = /^\d{3}[-\s]?\d{2}[-\s]?\d{4}$/;
const CC_RE = /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

const EMAIL_COL_KEYWORDS = ["email", "e-mail", "mail"];
const PHONE_COL_KEYWORDS = ["phone", "mobile", "tel", "cell", "contact_no", "phonenumber"];
const SSN_COL_KEYWORDS = ["ssn", "social_security", "sin", "national_id", "tax_id"];
const NAME_COL_KEYWORDS = ["first_name", "last_name", "full_name", "firstname", "lastname", "surname", "given_name"];
const CARD_COL_KEYWORDS = ["credit_card", "card_no", "card_number", "cc_no", "pan"];

function hitRate(values: string[], test: (v: string) => boolean): number {
  if (values.length === 0) return 0;
  return values.filter(test).length / values.length;
}

function colHas(colName: string, keywords: string[]): boolean {
  const lower = colName.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

/** Mask a string value for safe storage (never store raw PII). */
export function maskValue(value: string, piiType: PIIType): string {
  if (piiType === "email") {
    const [local, domain] = value.split("@");
    const maskedLocal = local.slice(0, 2) + "***";
    const parts = (domain ?? "").split(".");
    const maskedDomain = parts[0]?.slice(0, 2) + "***" + (parts[1] ? "." + parts[1] : "");
    return `${maskedLocal}@${maskedDomain}`;
  }
  if (piiType === "phone") {
    return value.slice(0, 3) + "****" + value.slice(-2);
  }
  if (piiType === "ssn") return "***-**-" + value.slice(-4);
  if (piiType === "credit_card") return "**** **** **** " + value.replace(/\D/g, "").slice(-4);
  // For names and IPs, show only first char + asterisks
  return value.slice(0, 1) + "*".repeat(Math.min(value.length - 1, 5));
}

/**
 * Detect PII in a column based on column name + value sample.
 * Returns null if no PII detected.
 */
export function detectPII(
  colName: string,
  nonNullValues: string[]
): { detected: boolean; type: PIIType | null } {
  const sample = nonNullValues.slice(0, 200);

  // Column-name based detection (high confidence)
  if (colHas(colName, EMAIL_COL_KEYWORDS) || hitRate(sample, (v) => EMAIL_RE.test(v)) >= 0.7)
    return { detected: true, type: "email" };

  if (colHas(colName, PHONE_COL_KEYWORDS) || hitRate(sample, (v) => PHONE_RE.test(v)) >= 0.7)
    return { detected: true, type: "phone" };

  if (colHas(colName, SSN_COL_KEYWORDS) || hitRate(sample, (v) => SSN_RE.test(v)) >= 0.5)
    return { detected: true, type: "ssn" };

  if (colHas(colName, CARD_COL_KEYWORDS) || hitRate(sample, (v) => CC_RE.test(v)) >= 0.5)
    return { detected: true, type: "credit_card" };

  if (hitRate(sample, (v) => IP_RE.test(v)) >= 0.7)
    return { detected: true, type: "ip_address" };

  // Name detection is name-based only (values are too generic)
  if (colHas(colName, NAME_COL_KEYWORDS))
    return { detected: true, type: "person_name" };

  return { detected: false, type: null };
}
