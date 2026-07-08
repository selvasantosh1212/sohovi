interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlight?: boolean;
}

interface PricingPreviewProps {
  plans: PricingPlan[];
  accent: string;
  note?: string;
}

const GRID_CLASS_BY_COUNT: Record<number, string> = {
  1: "grid gap-4 grid-cols-1 max-w-[260px]",
  2: "grid gap-4 grid-cols-1 sm:grid-cols-2",
  3: "grid gap-4 grid-cols-1 sm:grid-cols-3",
};

export function PricingPreview({ plans, accent, note }: PricingPreviewProps) {
  const gridClass = GRID_CLASS_BY_COUNT[plans.length] ?? GRID_CLASS_BY_COUNT[3];
  return (
    <section className="py-14" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[820px] px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--ink-soft)" }}>
          Planned pricing
        </p>
        <h2
          className="font-bold mb-2"
          style={{ fontSize: "clamp(26px, 3.4vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--ink)" }}
        >
          Simple, honest pricing
        </h2>
        <p className="mb-8 text-[14px]" style={{ color: "var(--ink-soft)" }}>
          Not final — tell us below if this works for you.
        </p>
        <div className={gridClass}>
          {plans.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-5"
              style={{
                background: p.highlight ? "var(--ink)" : "var(--paper)",
                border: `1px solid ${p.highlight ? "var(--ink)" : "var(--hair-strong)"}`,
              }}
            >
              <p className="text-[13px] font-bold mb-2" style={{ color: p.highlight ? accent : "var(--ink)" }}>
                {p.name}
              </p>
              <p className="mb-3">
                <span className="text-2xl font-bold" style={{ color: p.highlight ? "#fff" : "var(--ink)" }}>
                  {p.price}
                </span>
                {p.period && (
                  <span className="text-[12px] ml-1" style={{ color: p.highlight ? "rgba(255,255,255,0.6)" : "var(--ink-soft)" }}>
                    {p.period}
                  </span>
                )}
              </p>
              <ul className="space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="text-[12.5px]" style={{ color: p.highlight ? "rgba(255,255,255,0.8)" : "var(--ink-soft)" }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {note && (
          <p className="mt-6 text-[12px]" style={{ color: "var(--ink-soft)", opacity: 0.8 }}>
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
