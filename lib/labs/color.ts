/** Darkens a hex color by ~18% per channel — used for hover states. */
export function darkenColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.82));
  return (
    "#" +
    [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

/** A hex color at 6% alpha over white — used for the comparison-table highlight column. */
export function tintColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},0.06)`;
}
