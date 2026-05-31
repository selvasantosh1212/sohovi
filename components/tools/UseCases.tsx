export interface UseCase {
  persona: string;
  domain: string;
  icon: string;
  scenario: string;
  outcome: string;
}

interface UseCasesProps {
  cases: UseCase[];
  toolName: string;
}

export function UseCases({ cases, toolName }: UseCasesProps) {
  return (
    <section className="mt-14">
      <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--ink)" }}>
        Who uses {toolName}?
      </h2>
      <p className="text-[14px] mb-6" style={{ color: "var(--ink-soft)" }}>
        Real teams solving real problems — see if your use case is here.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 flex flex-col gap-3"
            style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}
          >
            {/* Persona row */}
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] shrink-0"
                style={{ background: "var(--cream-deep)" }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                  {c.persona}
                </p>
                <span
                  className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1"
                  style={{ background: "rgba(0,201,167,0.08)", color: "#007A65", border: "1px solid rgba(0,201,167,0.15)" }}
                >
                  {c.domain}
                </span>
              </div>
            </div>

            {/* Scenario */}
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {c.scenario}
            </p>

            {/* Outcome */}
            <p className="text-[12px] leading-relaxed italic border-t pt-3" style={{ color: "var(--ink-mute)", borderColor: "var(--hair)" }}>
              {c.outcome}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
