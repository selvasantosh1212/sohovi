/**
 * hyperloglog.ts
 *
 * Streaming cardinality estimator (Flajolet et al.). Used as a bounded-memory
 * fallback for `unique_count` when a column's distinct-value count grows too
 * large to track exactly (see EXACT_CARDINALITY_CAP in profiler.ts).
 *
 * Standard error at the default precision (b=12, m=4096 registers) is ~1.6%.
 * Registers are plain Uint8Array — cheap to structured-clone across workers
 * and to merge (per-register max) when combining per-chunk sketches.
 */

const DEFAULT_PRECISION = 12; // m = 4096 registers

/**
 * MurmurHash3 (x86, 32-bit). Column values are frequently structured/
 * sequential (e.g. "ORD-2024-00001", "item-99998") — a simpler hash like
 * FNV-1a has weak avalanche on shared-prefix, near-sequential strings and
 * was measured to skew cardinality estimates by >10% on exactly that input
 * shape. MurmurHash3 is the standard choice for HyperLogLog implementations
 * because its finalization mix avalanches well even on structured input.
 */
function murmurhash3_32(key: string, seed = 0): number {
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let h1 = seed;
  let i = 0;

  while (i < bytes) {
    let k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(i + 1) & 0xff) << 8) |
      ((key.charCodeAt(i + 2) & 0xff) << 16) |
      ((key.charCodeAt(i + 3) & 0xff) << 24);
    i += 4;

    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + 0xe6546b64) | 0;
  }

  let k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    // falls through
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    // falls through
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;
      k1 = Math.imul(k1, c1);
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = Math.imul(k1, c2);
      h1 ^= k1;
  }

  h1 ^= key.length;

  // Finalization mix — forces all bits of the hash to avalanche.
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

/** Leading zero bits of `w` within a `windowBits`-wide window, capped at windowBits. */
function leadingZerosInWindow(w: number, windowBits: number): number {
  if (w === 0) return windowBits;
  let n = 0;
  for (let bit = windowBits - 1; bit >= 0; bit--) {
    if ((w >>> bit) & 1) break;
    n++;
  }
  return n;
}

function alphaFor(m: number): number {
  if (m === 16) return 0.673;
  if (m === 32) return 0.697;
  if (m === 64) return 0.709;
  return 0.7213 / (1 + 1.079 / m);
}

export class HyperLogLog {
  readonly precision: number;
  readonly m: number;
  registers: Uint8Array;

  constructor(precision: number = DEFAULT_PRECISION, registers?: Uint8Array) {
    this.precision = precision;
    this.m = 1 << precision;
    this.registers = registers ?? new Uint8Array(this.m);
  }

  add(value: string): void {
    const hash = murmurhash3_32(value);
    const idx = hash & (this.m - 1);
    const remBits = 32 - this.precision;
    const w = hash >>> this.precision;
    const rank = leadingZerosInWindow(w, remBits) + 1;
    if (rank > this.registers[idx]) this.registers[idx] = rank;
  }

  /** Estimated number of distinct values added so far. */
  count(): number {
    const m = this.m;
    let sumInv = 0;
    let zeros = 0;
    for (let i = 0; i < m; i++) {
      const r = this.registers[i];
      sumInv += Math.pow(2, -r);
      if (r === 0) zeros++;
    }
    const alpha = alphaFor(m);
    let estimate = (alpha * m * m) / sumInv;

    // Small-range correction (linear counting) avoids over-estimating when
    // most registers are still empty.
    if (estimate <= 2.5 * m && zeros > 0) {
      estimate = m * Math.log(m / zeros);
    }
    return estimate;
  }

  clone(): HyperLogLog {
    return new HyperLogLog(this.precision, this.registers.slice());
  }

  /** Union with another sketch of the same precision (per-register max). */
  merge(other: HyperLogLog): HyperLogLog {
    if (other.m !== this.m) {
      throw new Error("Cannot merge HyperLogLog sketches with different precision");
    }
    const merged = new HyperLogLog(this.precision);
    for (let i = 0; i < this.m; i++) {
      merged.registers[i] = Math.max(this.registers[i], other.registers[i]);
    }
    return merged;
  }

  static mergeAll(sketches: HyperLogLog[]): HyperLogLog | null {
    if (sketches.length === 0) return null;
    return sketches.reduce((acc, s) => acc.merge(s));
  }
}
