/**
 * tdigest.ts
 *
 * Streaming quantile estimator (Dunning & Ertl "merging digest" variant).
 * Gives accurate percentiles (and therefore IQR-based outlier bounds) in one
 * pass, with bounded memory regardless of row count — replaces the previous
 * assumption that numeric columns are normally distributed (3sigma-only
 * outlier detection), and is naturally mergeable across file chunks.
 */

export interface Centroid {
  mean: number;
  weight: number;
}

const DEFAULT_COMPRESSION = 100;

/** k1 scale function — keeps centroids small near the tails, larger near the median. */
function scaleK(q: number, compression: number): number {
  const clamped = Math.min(1, Math.max(0, q));
  return (compression / (2 * Math.PI)) * Math.asin(2 * clamped - 1);
}

export class TDigest {
  compression: number;
  centroids: Centroid[] = [];
  min = Infinity;
  max = -Infinity;
  private buffer: number[] = [];

  constructor(compression: number = DEFAULT_COMPRESSION) {
    this.compression = compression;
  }

  add(x: number): void {
    if (!Number.isFinite(x)) return;
    if (x < this.min) this.min = x;
    if (x > this.max) this.max = x;
    this.buffer.push(x);
    if (this.buffer.length >= this.compression * 10) this._compress();
  }

  totalWeight(): number {
    return this.centroids.reduce((s, c) => s + c.weight, 0) + this.buffer.length;
  }

  private _compress(): void {
    if (this.buffer.length === 0 && this.centroids.length <= 1) return;

    const points: Centroid[] = this.buffer.map((x) => ({ mean: x, weight: 1 }));
    this.buffer = [];

    const all = [...this.centroids, ...points].sort((a, b) => a.mean - b.mean);
    if (all.length === 0) return;

    const total = all.reduce((s, c) => s + c.weight, 0);
    const merged: Centroid[] = [];

    let cur: Centroid = { ...all[0] };
    let weightSoFar = 0;

    for (let i = 1; i < all.length; i++) {
      const candidateWeight = cur.weight + all[i].weight;
      const q0 = weightSoFar / total;
      const q2 = (weightSoFar + candidateWeight) / total;

      if (scaleK(q2, this.compression) - scaleK(q0, this.compression) <= 1) {
        const newWeight = cur.weight + all[i].weight;
        cur = {
          mean: (cur.mean * cur.weight + all[i].mean * all[i].weight) / newWeight,
          weight: newWeight,
        };
      } else {
        weightSoFar += cur.weight;
        merged.push(cur);
        cur = { ...all[i] };
      }
    }
    merged.push(cur);

    this.centroids = merged;
  }

  private _finalize(): void {
    if (this.buffer.length > 0) this._compress();
  }

  /** Center-of-mass cumulative weight position for each centroid. */
  private _positions(): number[] {
    let cum = 0;
    const positions: number[] = [];
    for (const c of this.centroids) {
      positions.push(cum + c.weight / 2);
      cum += c.weight;
    }
    return positions;
  }

  /** Estimated value at quantile q (0..1), e.g. quantile(0.25) = Q1. */
  quantile(q: number): number | null {
    this._finalize();
    if (this.centroids.length === 0) return null;
    if (this.centroids.length === 1) return this.centroids[0].mean;

    const total = this.centroids.reduce((s, c) => s + c.weight, 0);
    const target = Math.min(1, Math.max(0, q)) * total;
    const positions = this._positions();
    const lastIdx = this.centroids.length - 1;

    if (target <= positions[0]) {
      const frac = positions[0] > 0 ? target / positions[0] : 0;
      return this.min + frac * (this.centroids[0].mean - this.min);
    }
    if (target >= positions[lastIdx]) {
      const frac =
        total > positions[lastIdx] ? (target - positions[lastIdx]) / (total - positions[lastIdx]) : 0;
      return this.centroids[lastIdx].mean + frac * (this.max - this.centroids[lastIdx].mean);
    }
    for (let i = 0; i < lastIdx; i++) {
      if (target >= positions[i] && target <= positions[i + 1]) {
        const frac =
          positions[i + 1] > positions[i]
            ? (target - positions[i]) / (positions[i + 1] - positions[i])
            : 0;
        return this.centroids[i].mean + frac * (this.centroids[i + 1].mean - this.centroids[i].mean);
      }
    }
    return this.centroids[lastIdx].mean;
  }

  /** Approximate fraction of values <= x. */
  cdf(x: number): number {
    this._finalize();
    if (this.centroids.length === 0) return 0;
    if (x <= this.min) return 0;
    if (x >= this.max) return 1;

    const total = this.centroids.reduce((s, c) => s + c.weight, 0);
    if (total === 0) return 0;
    const positions = this._positions();
    const lastIdx = this.centroids.length - 1;

    if (x <= this.centroids[0].mean) {
      const frac =
        this.centroids[0].mean > this.min ? (x - this.min) / (this.centroids[0].mean - this.min) : 0;
      return Math.max(0, Math.min(1, (frac * positions[0]) / total));
    }
    if (x >= this.centroids[lastIdx].mean) {
      const frac =
        this.max > this.centroids[lastIdx].mean
          ? (x - this.centroids[lastIdx].mean) / (this.max - this.centroids[lastIdx].mean)
          : 0;
      return Math.max(0, Math.min(1, (positions[lastIdx] + frac * (total - positions[lastIdx])) / total));
    }
    for (let i = 0; i < lastIdx; i++) {
      const m0 = this.centroids[i].mean;
      const m1 = this.centroids[i + 1].mean;
      if (x >= m0 && x <= m1) {
        const frac = m1 > m0 ? (x - m0) / (m1 - m0) : 0;
        const pos = positions[i] + frac * (positions[i + 1] - positions[i]);
        return Math.max(0, Math.min(1, pos / total));
      }
    }
    return 1;
  }

  /** Combine with another digest's centroids and recompress. */
  merge(other: TDigest): TDigest {
    this._finalize();
    other._finalize();
    const merged = new TDigest(this.compression);
    merged.min = Math.min(this.min, other.min);
    merged.max = Math.max(this.max, other.max);
    merged.centroids = [...this.centroids, ...other.centroids];
    merged._compress();
    return merged;
  }

  static mergeAll(digests: TDigest[]): TDigest | null {
    if (digests.length === 0) return null;
    return digests.reduce((acc, d) => acc.merge(d));
  }
}
