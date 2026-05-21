/** Standard regex templates used by conformity and validity rules. */

export const TEMPLATES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[\d\s\-\.\(\)]{7,15}$/,
  date_iso: /^\d{4}-\d{2}-\d{2}$/,
  date_us: /^\d{2}\/\d{2}\/\d{4}$/,
  date_eu: /^\d{2}\.\d{2}\.\d{4}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  url: /^https?:\/\/.+/i,
  postal_code_us: /^\d{5}(-\d{4})?$/,
  postal_code_in: /^\d{6}$/,
  invoice_id: /^(INV|inv)-?\d{4,}/i,
  currency_usd: /^\$[\d,]+(\.\d{2})?$/,
  integer: /^-?\d+$/,
  float: /^-?\d+(\.\d+)?$/,
  ssn: /^\d{3}-?\d{2}-?\d{4}$/,
  credit_card: /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/,
  date_dmy_dash:     /^\d{2}-\d{2}-\d{4}$/,
  date_dmy_slash:    /^\d{2}\/\d{2}\/\d{4}$/,
  date_ymd_slash:    /^\d{4}\/\d{2}\/\d{2}$/,
  date_dmy_dash_yy:  /^\d{2}-\d{2}-\d{2}$/,
  date_dmy_slash_yy: /^\d{2}\/\d{2}\/\d{2}$/,
  date_compact:      /^\d{8}$/,
} as const;

export type TemplateName = keyof typeof TEMPLATES;

export function getTemplate(name: string): RegExp | null {
  return (TEMPLATES as Record<string, RegExp>)[name] ?? null;
}

/** Normalize a value: trim whitespace, coerce empty string / "null" / "nan" → null */
export function norm(v: string | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "nan") return null;
  return s;
}

/** Extract the numeric index of a column by name */
export function colIndex(headers: string[], name: string): number {
  return headers.findIndex((h) => h === name);
}
