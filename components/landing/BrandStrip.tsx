const industries = [
  "Finance & Banking",
  "Healthcare",
  "E-commerce",
  "Logistics & Supply Chain",
  "Marketing Agencies",
  "SaaS & Tech",
  "Consulting",
  "Non-profit",
];

// Duplicate for seamless loop
const chips = [...industries, ...industries];

export function BrandStrip() {
  return (
    <section
      className="border-y py-8 overflow-hidden"
      style={{ background: "#FFFFFF", borderColor: "#E9E9EC" }}
    >
      <p
        className="text-center text-[11px] font-bold uppercase tracking-[0.18em] mb-5"
        style={{ color: "#5B5B63" }}
      >
        Built for data-sensitive teams in
      </p>
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {chips.map((industry, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-2 px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0"
              style={{
                color: "#5B5B63",
                background: "rgba(10,10,10,0.05)",
                border: "1px solid #E9E9EC",
              }}
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
