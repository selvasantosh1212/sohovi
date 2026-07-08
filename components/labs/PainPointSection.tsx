import type { LucideIcon } from "lucide-react";

interface Pain {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface PainPointSectionProps {
  headline: string;
  intro?: string;
  pains: Pain[];
}

export function PainPointSection({ headline, intro, pains }: PainPointSectionProps) {
  return (
    <section className="py-14" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[820px] px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--ink-soft)" }}>
          The problem
        </p>
        <h2
          className="font-bold mb-4"
          style={{ fontSize: "clamp(26px, 3.4vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--ink)" }}
        >
          {headline}
        </h2>
        {intro && (
          <p className="mb-8" style={{ color: "var(--ink-soft)", fontSize: "16px", lineHeight: 1.6 }}>
            {intro}
          </p>
        )}
        <div className="space-y-4">
          {pains.map((pain) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{ background: "var(--paper)", border: "1px solid var(--hair-strong)" }}
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: "var(--cream)", border: "1px solid var(--hair-strong)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                    {pain.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {pain.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
