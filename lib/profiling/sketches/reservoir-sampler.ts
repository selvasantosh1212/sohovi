/**
 * reservoir-sampler.ts
 *
 * Weighted reservoir sampler (Efraimidis-Spirakis "A-Res" algorithm).
 * Produces a uniform random sample of `capacity` items from a stream of
 * unknown length in O(capacity) memory and O(log capacity) per item — used
 * to replace "first N" sampling bias for both per-column sample_values and
 * the bulk-file row sample, which previously favored the start of each file
 * (or chunk).
 *
 * Backed by a binary min-heap keyed on each item's random priority so that
 * replacing the minimum is O(log capacity) instead of a linear rescan —
 * important since the bulk-file row sample runs at capacity ~50,000.
 */

interface HeapItem<T> {
  value: T;
  key: number;
}

class MinHeap<T> {
  private heap: HeapItem<T>[] = [];

  get size(): number {
    return this.heap.length;
  }

  peek(): HeapItem<T> | undefined {
    return this.heap[0];
  }

  push(item: HeapItem<T>): void {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  replaceTop(item: HeapItem<T>): void {
    this.heap[0] = item;
    this._bubbleDown(0);
  }

  toArray(): HeapItem<T>[] {
    return this.heap;
  }

  private _bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].key <= this.heap[i].key) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private _bubbleDown(i: number): void {
    const n = this.heap.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.heap[left].key < this.heap[smallest].key) smallest = left;
      if (right < n && this.heap[right].key < this.heap[smallest].key) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

export class ReservoirSampler<T> {
  readonly capacity: number;
  /** Total number of logical items offered (including ones not kept). */
  seen = 0;
  private heap = new MinHeap<T>();

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
  }

  add(value: T, weight: number = 1): void {
    this.seen++;
    const key = weight > 0 ? Math.pow(Math.random(), 1 / weight) : 0;
    this._offer(value, key);
  }

  private _offer(value: T, key: number): void {
    if (this.heap.size < this.capacity) {
      this.heap.push({ value, key });
      return;
    }
    const top = this.heap.peek();
    if (top && key > top.key) {
      this.heap.replaceTop({ value, key });
    }
  }

  values(): T[] {
    return this.heap.toArray().map((i) => i.value);
  }

  /**
   * Merge with another reservoir. Each surviving item's key already encodes
   * how strongly it competed to be kept (it's the max of `weight` uniform
   * draws from its original stream) — a reservoir kept from a stream of
   * 9000 items has keys concentrated much closer to 1 than one kept from a
   * stream of 1000 items, purely as a side effect of having survived more
   * competition. Re-using those keys as-is and just re-truncating the union
   * to `capacity` is therefore already correct and is exactly equivalent to
   * having reservoir-sampled the combined original stream directly — no
   * reweighting needed. (An earlier version of this method re-randomized
   * each item's key from a derived "effective weight", which is *not*
   * equivalent and was measured to systematically over-represent the
   * smaller-stream side by ~70% in testing.)
   */
  merge(other: ReservoirSampler<T>): ReservoirSampler<T> {
    const merged = new ReservoirSampler<T>(this.capacity);
    merged.seen = this.seen + other.seen;

    for (const item of this.heap.toArray()) merged._offer(item.value, item.key);
    for (const item of other.heap.toArray()) merged._offer(item.value, item.key);

    return merged;
  }
}
