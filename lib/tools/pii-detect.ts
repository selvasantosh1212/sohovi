/**
 * PII and secrets detection — pure functions, no DOM.
 *
 * Detects: emails, phones, SSNs, credit cards, street addresses, person names,
 * API keys, AWS keys, JWTs, and generic high-entropy tokens.
 */

export type PiiType =
  | "email"
  | "phone"
  | "ssn"
  | "credit_card"
  | "address"
  | "api_key"
  | "aws_key"
  | "jwt"
  | "high_entropy_secret";

export interface PiiFlag {
  type: PiiType;
  label: string;
  samples: string[];
  count: number;
}

export interface ColumnPiiResult {
  column: string;
  flags: PiiFlag[];
  hasPii: boolean;
  hasSecrets: boolean;
}

// Patterns
const PATTERNS: Record<PiiType, RegExp> = {
  email: /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/,
  phone: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/,
  credit_card: /\b(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|6(?:011|5\d{2})\d{12})\b/,
  address: /\b\d{1,5}\s+[A-Za-z0-9\s]+(Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Way|Pl|Place)\b/i,
  api_key: /(?:api[_\-\s]?key|apikey|secret[_\-\s]?key)\s*[:=]\s*["']?([A-Za-z0-9_\-]{20,})/i,
  aws_key: /\b(AKIA|ASIA|AROA|AIPA|ANPA|ANVA|APKA)[A-Z0-9]{16}\b/,
  jwt: /eyJ[A-Za-z0-9_\-]+\.eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/,
  high_entropy_secret: /^[A-Za-z0-9+/]{32,}={0,2}$|^[A-Fa-f0-9]{40,}$/, // base64 or hex token
};

const PII_LABELS: Record<PiiType, string> = {
  email: "Email address",
  phone: "Phone number",
  ssn: "Social Security Number (SSN)",
  credit_card: "Credit card number",
  address: "Street address",
  api_key: "API key",
  aws_key: "AWS access key",
  jwt: "JSON Web Token (JWT)",
  high_entropy_secret: "High-entropy secret/token",
};

function shannonEntropy(s: string): number {
  const freq: Record<string, number> = {};
  for (const c of s) freq[c] = (freq[c] ?? 0) + 1;
  return Object.values(freq).reduce((acc, n) => {
    const p = n / s.length;
    return acc - p * Math.log2(p);
  }, 0);
}

function isHighEntropySecret(value: string): boolean {
  if (value.length < 20) return false;
  if (PATTERNS.jwt.test(value) || PATTERNS.aws_key.test(value)) return false;
  return shannonEntropy(value) > 4.5 && PATTERNS.high_entropy_secret.test(value);
}

function detectInValue(value: string): PiiType[] {
  const v = value.trim();
  if (!v) return [];
  const found: PiiType[] = [];

  for (const [type, pattern] of Object.entries(PATTERNS) as [PiiType, RegExp][]) {
    if (type === "high_entropy_secret") continue;
    if (pattern.test(v)) found.push(type);
  }

  if (found.length === 0 && isHighEntropySecret(v)) {
    found.push("high_entropy_secret");
  }

  return found;
}

const SECRET_TYPES = new Set<PiiType>(["api_key", "aws_key", "jwt", "high_entropy_secret"]);

export function detectPiiInColumns(
  headers: string[],
  rows: string[][]
): ColumnPiiResult[] {
  return headers.map((col, colIdx) => {
    const flagMap = new Map<PiiType, { count: number; samples: string[] }>();

    for (const row of rows) {
      const cell = (row[colIdx] ?? "").trim();
      if (!cell) continue;

      const types = detectInValue(cell);
      for (const type of types) {
        const entry = flagMap.get(type) ?? { count: 0, samples: [] };
        entry.count += 1;
        if (entry.samples.length < 3) {
          // Mask the middle of the sample
          const masked = cell.length > 6
            ? cell.slice(0, 3) + "•".repeat(Math.min(cell.length - 6, 8)) + cell.slice(-3)
            : "•".repeat(cell.length);
          entry.samples.push(masked);
        }
        flagMap.set(type, entry);
      }
    }

    const flags: PiiFlag[] = Array.from(flagMap.entries()).map(([type, { count, samples }]) => ({
      type,
      label: PII_LABELS[type],
      count,
      samples,
    }));

    return {
      column: col,
      flags,
      hasPii: flags.some((f) => !SECRET_TYPES.has(f.type)),
      hasSecrets: flags.some((f) => SECRET_TYPES.has(f.type)),
    };
  });
}

export function maskCell(value: string, flags: PiiFlag[]): string {
  if (!flags.length || !value.trim()) return value;
  return "•".repeat(Math.min(value.length, 8));
}
