/* ============================================================
   Sohovi Marketing UI Kit — Sections.jsx
   Brand strip, capability blocks, pricing, final CTA, footer.
   Electric-Data palette. Reuses ../app/Primitives.jsx.
   ============================================================ */

function BrandStrip() {
  const names = ["Northwind", "Acme Data", "Lumen", "Cobalt", "Forge", "Meridian", "Cedar", "Vela"];
  const row = [...names, ...names];
  return (
    <section style={{ padding: "28px 0 8px", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
      <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".16em", color: "var(--text-mute)", marginBottom: 18 }}>Trusted by data teams at</p>
      <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
        <div style={{ display: "flex", gap: 56, width: "max-content", animation: "mkt-marquee 38s linear infinite" }}>
          {row.map((n, i) => (
            <span key={i} style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-faint)", whiteSpace: "nowrap" }}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    label: "Instant Understanding", accent: "#37376b", bg: "rgb(189, 189, 218)",
    headline: "See everything about your data before you write a single rule.",
    body: "Drop any CSV or Excel file. Sohovi reads every column — null rates, type distributions, unique counts, outliers, and PII flags — computed entirely client-side, in seconds.",
    bullets: ["Null rates, distributions & top-N values per column", "Auto type inference: email, phone, date, ID, numeric", "PII detection before you ever share data", "±3σ statistical outlier detection"],
    tags: ["CSV", "Excel", "100K+ rows", "Instant"],
  },
  {
    label: "Measurable Quality", accent: "#37376b", bg: "rgb(189, 189, 218)",
    headline: "A score you can show your team — and explain in plain English.",
    body: "Every DQ score is built from 10 ISO-standard dimensions. You see exactly which rules passed or failed, how many rows are affected, and why. No black box.",
    bullets: ["10 dimensions: Completeness, Validity, Uniqueness…", "Column, dataset, and catalog-level scores", "Drill into any failing rule to see affected rows", "Score history tracked across every run"],
    tags: ["10 Dimensions", "Transparent", "Drillable", "Historical"],
  },
  {
    label: "Intelligent Rules", accent: "#37376b", bg: "rgb(189, 189, 218)", solidInk: true,
    headline: "Rules that already know what kind of column they're looking at.",
    body: "Sohovi's in-browser ML reads your column names and data patterns to suggest the right quality rules before you ask. Accept, edit, extend, and reuse across any dataset.",
    bullets: ["Auto-detects: email → regex, ID → uniqueness, date → format", "No external API calls — ML runs in your browser", "Save rules as reusable templates", "Custom regex, ranges, lookups, cross-column checks"],
    tags: ["Auto-Suggest", "Custom Rules", "10 Rule Types", "Reusable"],
  },
];

function PillarMock({ idx }) {
  if (idx === 1) {
    const dims = [{ label: "Completeness", score: 94 }, { label: "Validity", score: 88 }, { label: "Uniqueness", score: 72 }, { label: "Accuracy", score: 95 }];
    return (
      <Card style={{ padding: 22 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-mute)", margin: "0 0 8px" }}>Live DQ Score</p>
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 16px" }}><ScoreGauge score={87} size={140} /></div>
        <DimensionBars dims={dims} />
      </Card>
    );
  }
  if (idx === 2) {
    const rules = [{ col: "email", r: "regex_match — email format" }, { col: "customer_id", r: "unique_column — no duplicates" }, { col: "age", r: "range_check — 0 ≤ age ≤ 120" }];
    return (
      <Card style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-mute)", margin: 0 }}>Suggested rules</p>
          <Chip tone="blue">ML SUGGESTED</Chip>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {rules.map((x) => (
            <div key={x.r} style={{ padding: 11, borderRadius: 11, background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text)" }}>{x.col}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, fontSize: 11.5, color: "var(--text-soft)" }}>
                <Icon name="check" size={12} color="var(--green-bright)" /> <span style={{ fontFamily: "var(--font-mono)" }}>{x.r}</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="green" size="sm" iconRight="arrow-right" full style={{ background: "rgb(255, 228, 57)", color: "#0A0A0A" }}>Apply all suggestions</Button>
      </Card>
    );
  }
  // idx 0 — profiling
  const cols = [{ col: "email", type: "Email", nr: 2.3, uq: 98.1, pii: true }, { col: "customer_id", type: "ID", nr: 0, uq: 100, pii: false }, { col: "phone", type: "Phone", nr: 8.7, uq: 91.2, pii: true }];
  return (
    <Card style={{ padding: 22 }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-mute)", margin: "0 0 12px" }}>customer_data.csv — profiling</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {cols.map((c) => (
          <div key={c.col} style={{ padding: 13, borderRadius: 12, background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text)" }}>{c.col}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Chip tone="blue">{c.type}</Chip>
                {c.pii && <Chip tone="neutral" style={{ background: "var(--score-danger-soft)", color: "var(--score-danger)", borderColor: "rgba(255,92,122,.3)" }}>PII</Chip>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-mute)", width: 56 }}>null {c.nr}%</span>
              <div style={{ flex: 1 }}><ScoreBar score={100 - c.nr} height={4} animate={false} /></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-mute)", width: 56 }}>uniq {c.uq}%</span>
              <div style={{ flex: 1 }}><ScoreBar score={c.uq} height={4} animate={false} /></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Capabilities() {
  return (
    <section style={{ padding: "88px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 640, marginBottom: 56 }}>
          <p className="ds-eyebrow">Platform Capabilities</p>
          <h2 className="ds-h1" style={{ marginTop: 14 }}>
            Everything your team needs to <span className="ds-grad-text">measure and improve</span> data quality.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {PILLARS.map((p, idx) => (
            <div key={p.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", background: p.bg || "var(--bg-soft)", border: p.dark ? "1px solid rgba(255,255,255,.12)" : "1px solid var(--line)", borderRadius: 28, padding: 44, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "relative", order: idx % 2 === 1 ? 2 : 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".16em", color: "#37376b", margin: 0 }}>{p.label}</p>
                <h3 className="ds-h2" style={{ margin: "14px 0 14px", color: p.dark ? "#fff" : undefined }}>{p.headline}</h3>
                <p className="ds-body" style={{ margin: "0 0 18px", color: p.solidInk ? "#000" : undefined }}>{p.body}</p>
                <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                  {p.bullets.map((b) => (
                    <li key={b} style={{ display: "flex", gap: 10, fontSize: 14, color: p.solidInk ? "#000" : "var(--text-soft)" }}>
                      <Icon name="check" size={16} color={p.accent} style={{ flexShrink: 0, marginTop: 2 }} /> {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.tags.map((t) => <Chip key={t} tone="neutral">{t}</Chip>)}
                </div>
              </div>
              <div style={{ position: "relative", order: idx % 2 === 1 ? 1 : 2 }}><PillarMock idx={idx} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  { name: "Solo", price: "$0", per: "forever", desc: "For individual analysts.", features: ["1 user", "Unlimited local profiling", "Up to 5 saved assets", "10 DQ dimensions", "Community support"], cta: "Start free", variant: "outline" },
  { name: "Team", price: "$24", per: "/ user / mo", desc: "For growing data teams.", features: ["Everything in Solo", "Unlimited assets & catalogs", "Business units & roles", "Scheduled checks & alerts", "Priority support"], cta: "Start 14-day trial", variant: "primary", featured: true },
  { name: "Enterprise", price: "Custom", per: "", desc: "For regulated orgs.", features: ["Everything in Team", "SSO & SCIM", "Audit logs & retention", "On-prem / VPC option", "Dedicated CSM"], cta: "Talk to sales", variant: "ghost" },
];

function Pricing() {
  return (
    <section style={{ padding: "72px 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p className="ds-eyebrow">Pricing</p>
          <h2 className="ds-h1" style={{ marginTop: 14 }}>Simple pricing that <span className="ds-grad-text">scales with you</span>.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "start" }}>
          {PLANS.map((pl) => (
            <Card key={pl.name} glow={pl.featured} style={{ padding: 28, ...(pl.featured ? { borderColor: "#0A0A0A", boxShadow: "0 0 0 1px #0A0A0A, 0 18px 40px -22px rgba(10,10,10,.25)" } : null) }}>
              {pl.featured && <Chip tone="blue" style={{ marginBottom: 14, background: "#0A0A0A", color: "#fff", border: "1px solid #0A0A0A", whiteSpace: "nowrap" }}>MOST POPULAR</Chip>}
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>{pl.name}</h3>
              <p style={{ fontSize: 13, color: "var(--text-mute)", margin: "0 0 16px" }}>{pl.desc}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{pl.price}</span>
                <span style={{ fontSize: 13, color: "var(--text-mute)" }}>{pl.per}</span>
              </div>
              <Button variant={pl.variant} full style={pl.featured ? { background: "#FFE439", color: "#0A0A0A" } : undefined}>{pl.cta}</Button>
              <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {pl.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "var(--text-soft)" }}>
                    <Icon name="check" size={15} color="var(--green-bright)" style={{ flexShrink: 0, marginTop: 1 }} /> {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)", position: "relative", background: "rgb(255, 228, 57)" }}>
        <div style={{ position: "relative", padding: "64px 56px", maxWidth: 720 }}>
          <p className="ds-eyebrow" style={{ color: "#37376b" }}>Get started</p>
          <h2 className="ds-h1" style={{ margin: "16px 0 14px" }}>Stop fixing bad data by hand. <span className="ds-grad-text">Start measuring it.</span></h2>
          <p className="ds-lead" style={{ margin: "0 0 28px" }}>Profile your first dataset in under a minute — free, in your browser, no upload.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" iconRight="arrow-right">Get started free</Button>
            <Button variant="outline" size="lg">Book a demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MktFooter() {
  const cols = [
    { h: "Product", links: ["Features", "Pricing", "Free tools", "Changelog", "Security"] },
    { h: "Resources", links: ["Docs", "Blog", "DQ dimensions", "Guides", "API"] },
    { h: "Company", links: ["About", "Careers", "Contact", "Privacy", "Terms"] },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "48px 24px 36px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--grad-bg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-blue-soft)" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>S</span>
            </div>
            <img src={SOHOVI_LOGO_M} alt="Sohovi" style={{ height: 16, filter: "var(--logo-filter)", opacity: 0.95 }} />
          </div>
          <p style={{ fontSize: 13, color: "var(--text-mute)", maxWidth: 260, lineHeight: 1.6, margin: 0 }}>Privacy-first data quality. Profile, score, and repair your data — entirely in your browser.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "7px 12px", borderRadius: 999, background: "#0A0A0A", border: "1px solid #0A0A0A", whiteSpace: "nowrap" }}>
            <Icon name="shield-check" size={14} color="#FFE439" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#FFE439", whiteSpace: "nowrap" }}>Zero bytes uploaded</span>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--text-mute)", margin: "0 0 14px" }}>{c.h}</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {c.links.map((l) => (
                <li key={l}><a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13.5, color: "var(--text-soft)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-soft)"}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1180, margin: "36px auto 0", paddingTop: 22, borderTop: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>© 2026 Sohovi, Inc. All rights reserved.</span>
        <span style={{ fontSize: 12.5, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>Made for data teams who care.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { BrandStrip, Capabilities, Pricing, FinalCTA, MktFooter });
