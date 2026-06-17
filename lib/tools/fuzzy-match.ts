/**
 * Fuzzy string similarity using Levenshtein distance.
 * Returns a score 0–1 (1 = identical).
 */
import { distance } from "fastest-levenshtein";

export function similarity(a: string, b: string): number {
  const s = a.toLowerCase().trim();
  const t = b.toLowerCase().trim();
  if (s === t) return 1;
  const maxLen = Math.max(s.length, t.length);
  if (maxLen === 0) return 1;
  return 1 - distance(s, t) / maxLen;
}
