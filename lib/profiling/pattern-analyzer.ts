import type { PatternEntry } from "@/types/profiling.types";

/**
 * Convert a string value into a character-class pattern.
 * Uppercase letter → A, lowercase letter → a, digit → 9, keep other chars.
 * Consecutive same-class chars are collapsed: "aaaa" → "a+"
 */
function toPattern(value: string): string {
  let pattern = "";
  let prev: string | null = null;
  let run = 0;

  function flush() {
    if (prev === null) return;
    pattern += run > 2 ? `${prev}+` : prev.repeat(run);
  }

  for (const ch of value) {
    let cls: string;
    if (ch >= "A" && ch <= "Z") cls = "A";
    else if (ch >= "a" && ch <= "z") cls = "a";
    else if (ch >= "0" && ch <= "9") cls = "9";
    else cls = ch;

    if (cls === prev) {
      run++;
    } else {
      flush();
      prev = cls;
      run = 1;
    }
  }
  flush();
  return pattern;
}

/**
 * Analyze value patterns for a sample of string values.
 * Returns top patterns sorted by count descending.
 */
export function analyzePatterns(values: string[], maxPatterns = 10): PatternEntry[] {
  if (values.length === 0) return [];

  const sample = values.slice(0, 500);
  const freqMap = new Map<string, number>();

  for (const v of sample) {
    if (v.trim() === "") continue;
    const pat = toPattern(v.slice(0, 30)); // cap at 30 chars to avoid mega-patterns
    freqMap.set(pat, (freqMap.get(pat) ?? 0) + 1);
  }

  const sorted = [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxPatterns);

  return sorted.map(([pattern, count]) => ({
    pattern,
    count,
    pct: Math.round((count / sample.length) * 10000) / 100,
  }));
}
