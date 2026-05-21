import Link from "next/link";

export function FinalCTA() {
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--terracotta)" }}
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="mx-auto max-w-3xl px-6 text-center space-y-8 relative">
        <div className="space-y-4">
          <h2
            className="font-bold text-white"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05 }}
          >
            Start measuring your{" "}
            <em className="serif-accent" style={{ color: "rgba(255,255,255,0.85)" }}>data quality</em>
            {" "}today.
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Free forever for individual use. Pro plans from $29/month when you need more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-full text-base transition-all"
            style={{ background: "#fff", color: "var(--ink)", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          >
            Start for Free →
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center font-medium px-8 py-3 rounded-full text-base transition-all"
            style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)", background: "transparent" }}
          >
            View Pricing
          </Link>
        </div>

        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          No credit card required &nbsp;·&nbsp; 100% browser-based &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  );
}
