import type { ReactNode } from "react";

interface LabsHeroProps {
  eyebrow: string;
  headline: ReactNode;
  subheadline: string;
  accent: string;
  ctaLabel: string;
}

export function LabsHero({ eyebrow, headline, subheadline, accent, ctaLabel }: LabsHeroProps) {
  return (
    <section className="pt-16 pb-8">
      <div className="mx-auto max-w-[820px] px-6 text-center">
        <div
          className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-[12px] font-semibold"
          style={{ background: "var(--cream)", border: "1px solid var(--hair)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} aria-hidden />
          <span style={{ color: "var(--ink-soft)" }}>{eyebrow}</span>
        </div>

        <h1
          className="font-extrabold leading-[1.08]"
          style={{ fontSize: "clamp(34px, 5.2vw, 60px)", letterSpacing: "-0.035em", color: "var(--ink)", textWrap: "balance" } as React.CSSProperties}
        >
          {headline}
        </h1>

        <p
          className="mx-auto mt-6"
          style={{ fontSize: "18px", lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "560px", textWrap: "pretty" } as React.CSSProperties}
        >
          {subheadline}
        </p>

        <div className="mt-8">
          <a
            href="#build-this"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "var(--ink)", borderRadius: "12px" }}
          >
            {ctaLabel} →
          </a>
        </div>

        <p className="mt-4 text-[12px]" style={{ color: "var(--ink-soft)", opacity: 0.75 }}>
          Not built yet — we&apos;re validating demand first. Takes 10 seconds.
        </p>
      </div>
    </section>
  );
}
