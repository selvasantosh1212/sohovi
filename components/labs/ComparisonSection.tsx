interface ComparisonRow {
  feature: string;
  us: string;
  them: string;
}

interface ComparisonSectionProps {
  toolName: string;
  competitorLabel: string;
  rows: ComparisonRow[];
  note?: string;
  accent: string;
}

export function ComparisonSection({ toolName, competitorLabel, rows, note, accent }: ComparisonSectionProps) {
  return (
    <section className="py-14" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[820px] px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--ink-soft)" }}>
          How it compares
        </p>
        <h2
          className="font-bold mb-6"
          style={{ fontSize: "clamp(26px, 3.4vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--ink)" }}
        >
          {toolName} vs. {competitorLabel}
        </h2>
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid var(--hair-strong)" }}>
          <div style={{ minWidth: "560px" }}>
            <div className="grid grid-cols-[1.2fr_1fr_1fr]" style={{ background: "var(--cream)" }}>
              <div className="p-4" />
              <div className="p-4 text-[13px] font-bold" style={{ color: "var(--ink)" }}>
                {toolName}
              </div>
              <div className="p-4 text-[13px] font-bold" style={{ color: "var(--ink-soft)" }}>
                {competitorLabel}
              </div>
            </div>
            {rows.map((r) => (
              <div
                key={r.feature}
                className="grid grid-cols-[1.2fr_1fr_1fr]"
                style={{ background: "var(--paper)", borderTop: "1px solid var(--hair)" }}
              >
                <div className="p-4 text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                  {r.feature}
                </div>
                <div className="p-4 text-[13px] font-semibold" style={{ color: accent }}>
                  {r.us}
                </div>
                <div className="p-4 text-[13px]" style={{ color: "var(--ink-soft)" }}>
                  {r.them}
                </div>
              </div>
            ))}
          </div>
        </div>
        {note && (
          <p className="mt-4 text-[12px]" style={{ color: "var(--ink-soft)", opacity: 0.8 }}>
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
