import { similarity } from "./fuzzy-match";

export interface FuzzyPair {
  keyA: string;
  keyB: string;
  rowA: string[];
  rowB: string[];
  score: number;
}

/**
 * Pairs rows that a keyed diff reported as only-in-A / only-in-B but whose
 * keys are near-misses — "ACME Corp." against "ACME Corp", a transposed digit
 * in an invoice number, a trailing whitespace difference that survived
 * normalization.
 *
 * This is the step that turns a reconciliation from "412 rows disappeared" into
 * "398 of them are the same records with a slightly different key", which is
 * the usual truth in migration and month-end work.
 *
 * Greedy best-match: each A row takes its highest-scoring unclaimed B row above
 * `threshold`. Not globally optimal — an assignment solver would be — but it is
 * stable, explainable to a user staring at the result, and O(n·m) rather than
 * cubic, which matters because this runs in the browser.
 */
export function fuzzyPairKeys(
  onlyInA: string[][],
  onlyInB: string[][],
  keyIndicesA: number[],
  keyIndicesB: number[],
  threshold = 0.85
): FuzzyPair[] {
  const keyOf = (row: string[], idx: number[]) =>
    idx.map((i) => (row[i] ?? "").trim()).join(" ");

  const claimed = new Set<number>();
  const pairs: FuzzyPair[] = [];

  for (const rowA of onlyInA) {
    const keyA = keyOf(rowA, keyIndicesA);
    if (!keyA) continue;

    let bestIdx = -1;
    let bestScore = threshold;

    for (let j = 0; j < onlyInB.length; j++) {
      if (claimed.has(j)) continue;
      const keyB = keyOf(onlyInB[j], keyIndicesB);
      if (!keyB) continue;
      const score = similarity(keyA, keyB);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = j;
      }
    }

    if (bestIdx !== -1) {
      claimed.add(bestIdx);
      pairs.push({
        keyA,
        keyB: keyOf(onlyInB[bestIdx], keyIndicesB),
        rowA,
        rowB: onlyInB[bestIdx],
        score: bestScore,
      });
    }
  }

  return pairs.sort((a, b) => b.score - a.score);
}
