import { Check } from "lucide-react";

interface SolutionSectionProps {
  headline: string;
  intro?: string;
  bullets: string[];
  accent: string;
}

export function SolutionSection({ headline, intro, bullets, accent }: SolutionSectionProps) {
  return (
    <section className="py-14" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[820px] px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--ink-soft)" }}>
          What we&apos;d build
        </p>
        <h2
          className="font-bold mb-4"
          style={{ fontSize: "clamp(26px, 3.4vw, 38px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--ink)" }}
        >
          {headline}
        </h2>
        {intro && (
          <p className="mb-6" style={{ color: "var(--ink-soft)", fontSize: "16px", lineHeight: 1.6 }}>
            {intro}
          </p>
        )}
        <ul className="grid sm:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 rounded-xl p-4" style={{ background: "var(--cream)" }}>
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
              <span className="text-[14px]" style={{ color: "var(--ink)" }}>
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
