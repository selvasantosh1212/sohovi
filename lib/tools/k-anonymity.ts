/**
 * k-anonymity computation — pure functions, no DOM.
 *
 * Given rows + quasi-identifier column names, returns the minimum equivalence
 * class size (k) and identifies which rows fall into classes below the target k.
 */

export interface KAnonResult {
  k: number;
  targetK: number;
  equivalenceClasses: number;
  violatingRowCount: number;
  violatingRowIndices: number[];
  suggestions: string[];
}

export function computeKAnonymity(
  headers: string[],
  rows: string[][],
  quasiIdCols: string[],
  targetK: number
): KAnonResult {
  const colIndices = quasiIdCols.map((q) => headers.indexOf(q)).filter((i) => i !== -1);

  if (!colIndices.length || !rows.length) {
    return { k: 0, targetK, equivalenceClasses: 0, violatingRowCount: 0, violatingRowIndices: [], suggestions: [] };
  }

  // Group rows by their quasi-identifier values
  const groupMap = new Map<string, number[]>();
  rows.forEach((row, idx) => {
    const key = colIndices.map((i) => (row[i] ?? "").trim().toLowerCase()).join("\x00");
    const group = groupMap.get(key) ?? [];
    group.push(idx);
    groupMap.set(key, group);
  });

  const classSizes = Array.from(groupMap.values()).map((g) => g.length);
  const minK = Math.min(...classSizes);

  const violatingRowIndices: number[] = [];
  for (const [, indices] of groupMap) {
    if (indices.length < targetK) {
      violatingRowIndices.push(...indices);
    }
  }

  const suggestions = buildSuggestions(quasiIdCols, minK, targetK);

  return {
    k: minK,
    targetK,
    equivalenceClasses: groupMap.size,
    violatingRowCount: violatingRowIndices.length,
    violatingRowIndices,
    suggestions,
  };
}

function buildSuggestions(quasiIdCols: string[], currentK: number, targetK: number): string[] {
  if (currentK >= targetK) return [];
  const suggestions: string[] = [];

  suggestions.push(`Current k=${currentK} is below the target of k=${targetK}. The following generalizations may help:`);

  for (const col of quasiIdCols) {
    if (/dob|birth|date/i.test(col)) {
      suggestions.push(`• "${col}": if using year, try generalizing to decade age band (40–49) instead.`);
    } else if (/zip|postal/i.test(col)) {
      suggestions.push(`• "${col}": if using 5-digit ZIP, try truncating to 3 digits or suppressing entirely.`);
    } else if (/age/i.test(col)) {
      suggestions.push(`• "${col}": use wider age bands (e.g. 10-year instead of 5-year).`);
    } else if (/city|state|region/i.test(col)) {
      suggestions.push(`• "${col}": consider removing or aggregating to a larger region.`);
    } else {
      suggestions.push(`• "${col}": consider suppressing rare values or generalizing to broader categories.`);
    }
  }

  if (quasiIdCols.length > 3) {
    suggestions.push(`• You have ${quasiIdCols.length} quasi-identifiers selected. Removing the least informative one often raises k significantly.`);
  }

  return suggestions;
}
