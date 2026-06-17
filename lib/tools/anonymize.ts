/**
 * De-identification transforms — pure functions, no DOM.
 *
 * Actions: suppress, mask, pseudonymize, generalize (date/zip/numeric), top/bottom-code.
 */

export type DeIdAction =
  | "keep"
  | "suppress"
  | "mask"
  | "pseudonymize"
  | "generalize_date"
  | "generalize_zip"
  | "generalize_numeric"
  | "top_bottom_code";

export type ColumnClass = "direct" | "quasi" | "sensitive" | "safe";

export const COLUMN_CLASS_LABELS: Record<ColumnClass, string> = {
  direct: "Direct identifier",
  quasi: "Quasi-identifier",
  sensitive: "Sensitive attribute",
  safe: "Safe",
};

export const ACTION_LABELS: Record<DeIdAction, string> = {
  keep: "Keep as-is",
  suppress: "Suppress (drop column)",
  mask: "Mask (replace with ••••)",
  pseudonymize: "Pseudonymize (stable fake ID)",
  generalize_date: "Generalize → year / age band",
  generalize_zip: "Generalize → first 3 digits",
  generalize_numeric: "Generalize → range band",
  top_bottom_code: "Top/bottom-code outliers",
};

// --- Auto-classification by column name ---

const DIRECT_PATTERNS = [
  /\bname\b/i, /\bfirst.?name\b/i, /\blast.?name\b/i, /\bemail\b/i,
  /\bphone\b/i, /\bmobile\b/i, /\btel\b/i, /\bssn\b/i, /\bsocial.?sec/i,
  /\baddress\b/i, /\bstreet\b/i, /\bip.?addr/i, /\bpassport\b/i,
  /\bnational.?id\b/i, /\bdriv.+licen/i, /\bmed.?rec/i, /\bmrn\b/i,
];

const QUASI_PATTERNS = [
  /\bdob\b/i, /\bdate.?of.?birth\b/i, /\bbirth.?date\b/i, /\bage\b/i,
  /\bzip\b/i, /\bpostal\b/i, /\bpost.?code\b/i, /\bcity\b/i,
  /\bgender\b/i, /\bsex\b/i, /\bethni/i, /\brace\b/i,
  /\bjob.?title\b/i, /\boccupation\b/i, /\bdepartment\b/i,
  /\bcountry\b/i, /\bstate\b/i, /\bregion\b/i,
  /\beducation\b/i, /\bmarital\b/i, /\bnational/i,
];

const SENSITIVE_PATTERNS = [
  /\bdiagnos/i, /\bcondition\b/i, /\bdisease\b/i, /\bmedication\b/i,
  /\bsalary\b/i, /\bincome\b/i, /\bwage\b/i, /\bpay\b/i,
  /\breligion\b/i, /\bpolitical\b/i, /\bsexual/i,
  /\btest.?result\b/i, /\blab.?result\b/i, /\bbmi\b/i,
  /\bcredit.?score\b/i,
];

export function classifyColumn(header: string): ColumnClass {
  if (DIRECT_PATTERNS.some((p) => p.test(header))) return "direct";
  if (SENSITIVE_PATTERNS.some((p) => p.test(header))) return "sensitive";
  if (QUASI_PATTERNS.some((p) => p.test(header))) return "quasi";
  return "safe";
}

export function defaultActionForClass(cls: ColumnClass): DeIdAction {
  if (cls === "direct") return "mask";
  if (cls === "sensitive") return "mask";
  if (cls === "quasi") return "generalize_date"; // will refine per-column
  return "keep";
}

export function suggestAction(header: string, cls: ColumnClass): DeIdAction {
  if (cls === "safe") return "keep";
  if (cls === "direct") {
    if (/name/i.test(header)) return "pseudonymize";
    if (/email/i.test(header)) return "mask";
    if (/phone|mobile|tel/i.test(header)) return "mask";
    return "suppress";
  }
  if (cls === "quasi") {
    if (/dob|birth|date/i.test(header)) return "generalize_date";
    if (/zip|postal/i.test(header)) return "generalize_zip";
    if (/age|income|salary/i.test(header)) return "generalize_numeric";
    return "generalize_date";
  }
  if (cls === "sensitive") return "mask";
  return "keep";
}

// --- Transform functions ---

export function maskValue(): string {
  return "••••••••";
}

export function pseudonymizeValue(value: string, pseudoMap: Map<string, string>): string {
  const v = value.trim();
  if (!v) return v;
  if (pseudoMap.has(v)) return pseudoMap.get(v)!;
  const id = `ID-${String(pseudoMap.size + 1).padStart(6, "0")}`;
  pseudoMap.set(v, id);
  return id;
}

export function generalizeDate(value: string): string {
  const v = value.trim();
  if (!v) return v;
  // Try to extract a 4-digit year
  const yearMatch = v.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(yearMatch[0]);
    if (yearNum > 1900 && yearNum <= currentYear) {
      const age = currentYear - yearNum;
      if (age >= 0 && age <= 120) {
        const band = Math.floor(age / 10) * 10;
        return `${band}–${band + 9}`;
      }
    }
    return yearMatch[0]; // return just the year
  }
  return v;
}

export function generalizeZip(value: string): string {
  const v = value.trim().replace(/\s/g, "");
  if (!v) return v;
  return v.slice(0, 3) + "XX";
}

export function generalizeNumeric(value: string, bandSize = 10): string {
  const v = value.trim();
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  const lower = Math.floor(n / bandSize) * bandSize;
  return `${lower}–${lower + bandSize - 1}`;
}

export function topBottomCode(value: string, low: number, high: number): string {
  const v = value.trim();
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  if (n < low) return `<${low}`;
  if (n > high) return `>${high}`;
  return v;
}

// --- Apply transforms to a full dataset ---

export interface ColumnConfig {
  header: string;
  colIndex: number;
  classification: ColumnClass;
  action: DeIdAction;
}

export interface DeIdResult {
  headers: string[];
  rows: string[][];
  pseudoMaps: Map<string, Map<string, string>>; // col → value→id
  methodsLog: string;
}

export function applyDeIdentification(
  originalHeaders: string[],
  originalRows: string[][],
  configs: ColumnConfig[]
): DeIdResult {
  const suppressedCols = new Set(configs.filter((c) => c.action === "suppress").map((c) => c.colIndex));
  const newHeaders = originalHeaders.filter((_, i) => !suppressedCols.has(i));
  const headerIndexMap = originalHeaders.map((_, i) => i).filter((i) => !suppressedCols.has(i));

  const pseudoMaps = new Map<string, Map<string, string>>();
  configs.filter((c) => c.action === "pseudonymize").forEach((c) => {
    pseudoMaps.set(c.header, new Map());
  });

  // Compute numeric bounds for top/bottom coding
  const numericBounds = new Map<number, { low: number; high: number }>();
  configs.filter((c) => c.action === "top_bottom_code").forEach((c) => {
    const values = originalRows.map((r) => parseFloat(r[c.colIndex] ?? "")).filter((n) => !isNaN(n));
    if (values.length) {
      values.sort((a, b) => a - b);
      const low = values[Math.floor(values.length * 0.05)] ?? values[0];
      const high = values[Math.floor(values.length * 0.95)] ?? values[values.length - 1];
      numericBounds.set(c.colIndex, { low, high });
    }
  });

  const configByIndex = new Map(configs.map((c) => [c.colIndex, c]));

  const newRows = originalRows.map((row) =>
    headerIndexMap.map((origIdx) => {
      const cell = row[origIdx] ?? "";
      const cfg = configByIndex.get(origIdx);
      if (!cfg || cfg.action === "keep") return cell;

      switch (cfg.action) {
        case "mask": return maskValue();
        case "pseudonymize": {
          const pMap = pseudoMaps.get(cfg.header)!;
          return pseudonymizeValue(cell, pMap);
        }
        case "generalize_date": return generalizeDate(cell);
        case "generalize_zip": return generalizeZip(cell);
        case "generalize_numeric": return generalizeNumeric(cell);
        case "top_bottom_code": {
          const bounds = numericBounds.get(origIdx);
          return bounds ? topBottomCode(cell, bounds.low, bounds.high) : cell;
        }
        default: return cell;
      }
    })
  );

  const methodsLog = buildMethodsLog(originalHeaders, configs, pseudoMaps, originalRows.length);

  return { headers: newHeaders, rows: newRows, pseudoMaps, methodsLog };
}

function buildMethodsLog(
  headers: string[],
  configs: ColumnConfig[],
  pseudoMaps: Map<string, Map<string, string>>,
  rowCount: number
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines = [
    "DE-IDENTIFICATION METHODS LOG",
    `Date: ${date}`,
    `Rows processed: ${rowCount}`,
    `Total columns: ${headers.length}`,
    "",
    "COLUMN TRANSFORMATIONS",
    "======================",
  ];

  for (const cfg of configs) {
    const actionLabel = ACTION_LABELS[cfg.action];
    const classLabel = COLUMN_CLASS_LABELS[cfg.classification];
    lines.push(`${cfg.header}`);
    lines.push(`  Classification: ${classLabel}`);
    lines.push(`  Action applied: ${actionLabel}`);
    if (cfg.action === "pseudonymize") {
      const map = pseudoMaps.get(cfg.header);
      lines.push(`  Unique values pseudonymized: ${map?.size ?? 0}`);
    }
    lines.push("");
  }

  lines.push("NOTES");
  lines.push("=====");
  lines.push("- Pseudonymization uses a stable in-session map (not persisted).");
  lines.push("- Date generalization converts DOB to decade age band (e.g. 40–49).");
  lines.push("- ZIP generalization retains first 3 digits only.");
  lines.push("- No data was uploaded to any server. All transforms ran in-browser.");

  return lines.join("\n");
}
