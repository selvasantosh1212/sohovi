/**
 * Two-file keyed diff — pure functions, no DOM.
 *
 * Given two sets of rows and a list of key columns, returns four buckets:
 * onlyInA, onlyInB, changed (key match but fields differ), unchanged.
 */

export interface FieldDiff {
  column: string;
  a: string;
  b: string;
}

export interface ChangedRow {
  key: string;
  rowA: string[];
  rowB: string[];
  diffs: FieldDiff[];
}

export interface DiffResult {
  onlyInA: string[][];
  onlyInB: string[][];
  changed: ChangedRow[];
  unchanged: string[][];
  headers: string[];
}

function makeKey(row: string[], keyIndices: number[]): string {
  return keyIndices.map((i) => (row[i] ?? "").toLowerCase().trim()).join("\x00");
}

function suggestKeyColumns(headers: string[]): string[] {
  const keyPatterns = [/^id$/i, /[_-]id$/i, /^email$/i, /^uuid$/i, /^key$/i, /^ref$/i];
  return headers.filter((h) => keyPatterns.some((p) => p.test(h)));
}

export { suggestKeyColumns };

export function keyedDiff(
  headersA: string[],
  rowsA: string[][],
  headersB: string[],
  rowsB: string[][],
  keyColumns: string[]
): DiffResult {
  // Build a merged header set: headersA union headersB (A first)
  const allHeaders = [...headersA];
  for (const h of headersB) {
    if (!allHeaders.includes(h)) allHeaders.push(h);
  }

  const keyIdxA = keyColumns.map((k) => headersA.indexOf(k)).filter((i) => i !== -1);
  const keyIdxB = keyColumns.map((k) => headersB.indexOf(k)).filter((i) => i !== -1);

  // Index B by key
  const mapB = new Map<string, string[]>();
  for (const row of rowsB) {
    const key = makeKey(row, keyIdxB);
    mapB.set(key, row);
  }

  const onlyInA: string[][] = [];
  const onlyInB: string[][] = [];
  const changed: ChangedRow[] = [];
  const unchanged: string[][] = [];
  const seenKeys = new Set<string>();

  for (const rowA of rowsA) {
    const key = makeKey(rowA, keyIdxA);
    seenKeys.add(key);
    const rowB = mapB.get(key);

    if (!rowB) {
      onlyInA.push(rowA);
      continue;
    }

    const diffs: FieldDiff[] = [];
    for (const col of allHeaders) {
      const idxA = headersA.indexOf(col);
      const idxB = headersB.indexOf(col);
      const valA = idxA !== -1 ? (rowA[idxA] ?? "").trim() : "";
      const valB = idxB !== -1 ? (rowB[idxB] ?? "").trim() : "";
      if (valA !== valB) diffs.push({ column: col, a: valA, b: valB });
    }

    if (diffs.length === 0) {
      unchanged.push(rowA);
    } else {
      changed.push({ key, rowA, rowB, diffs });
    }
  }

  for (const row of rowsB) {
    const key = makeKey(row, keyIdxB);
    if (!seenKeys.has(key)) onlyInB.push(row);
  }

  return { onlyInA, onlyInB, changed, unchanged, headers: allHeaders };
}
