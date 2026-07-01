import type { ColumnProfile } from "@/types/profiling.types";

/** Composes a plain-English summary of a column's profile, for the export's prose sheet. */
export function buildColumnNarrative(profile: ColumnProfile, columnName: string): string {
  const article = /^[aeiou]/i.test(profile.inferred_type) ? "an" : "a";

  if (profile.row_count === 0) {
    return `"${columnName}" is ${article} ${profile.inferred_type} column with no data.`;
  }

  const sentences: string[] = [];

  sentences.push(
    `"${columnName}" is ${article} ${profile.inferred_type} column with ${profile.row_count.toLocaleString()} rows.`
  );

  if (profile.null_pct > 0) {
    sentences.push(`${profile.null_pct}% of values are missing.`);
  }

  sentences.push(`${profile.unique_pct}% are unique.`);

  if (profile.pattern_summary.length > 0) {
    const top = profile.pattern_summary[0];
    sentences.push(`Most common format "${top.pattern}" (${top.pct}%).`);
  }

  if (profile.pii_detected) {
    sentences.push(`Appears to contain PII (${profile.pii_type ?? "PII"}).`);
  }

  return sentences.join(" ");
}
