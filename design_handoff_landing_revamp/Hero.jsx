/* ============================================================
   Sohovi Marketing UI Kit — Hero.jsx
   Glass nav pill + dark glowing hero with a live DQ-dashboard
   mock. Electric-Data palette. Reuses ../app/Primitives.jsx.
   ============================================================ */

const SOHOVI_LOGO_M = "assets/sohovi-logo.svg";
const NAV_LINKS = ["Features", "How it works", "Free tools", "Pricing", "FAQ"];

function MktNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "14px 24px 8px" }}>
      <nav style={{
        width: "100%", maxWidth: 1180, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--glass-bg)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        border: "1px solid var(--line)", borderRadius: 999, padding: "8px 8px 8px 18px",
        boxShadow: scrolled ? "0 10px 30px -12px rgba(0,0,0,.7)" : "none", transition: "box-shadow .3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--grad-bg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-blue-soft)" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>S</span>
          </div>
          <img src={SOHOVI_LOGO_M} alt="Sohovi" style={{ height: 17, filter: "var(--logo-filter)", opacity: 0.95 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="mkt-navlinks">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-soft)", padding: "7px 13px", borderRadius: 999, textDecoration: "none", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-soft)"; }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-soft)", padding: "8px 14px", textDecoration: "none" }}>Sign in</a>
          <Button size="sm" variant="primary">Get started</Button>
        </div>
      </nav>
    </div>
  );
}

/* Compact live-dashboard mock for the hero */
function HeroMock() {
  const dims = [
    { label: "Completeness", score: 94 },
    { label: "Validity", score: 88 },
    { label: "Uniqueness", score: 72 },
    { label: "Accuracy", score: 95 },
    { label: "Consistency", score: 81 },
  ];
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(10,10,10,.04), 0 30px 70px -34px rgba(10,10,10,.22)", background: "var(--surface)" }}>
      {/* chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--bg-soft)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5C7A", "#FFC53D", "#22E586"].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c }} />)}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-mute)", marginLeft: 6 }}>app.sohovi.com/dashboard</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, color: "var(--green-bright)", background: "var(--green-soft)", padding: "3px 9px", borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--green-bright)", boxShadow: glowOn() ? "0 0 6px var(--green-bright)" : "none" }} /> Live
        </span>
      </div>
      {/* body */}
      <div style={{ padding: 16, background: "var(--bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>customer_data.csv</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-mute)", marginTop: 2 }}>128,447 rows · 23 columns · profiled 3s ago</div>
          </div>
          <ScoreBadge score={87} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 12 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <ScoreGauge score={87} size={120} label="" />
            <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, color: "var(--text-mute)", marginTop: 4 }}>Overall Health</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 12, flex: 1 }}>
              <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, color: "var(--text-mute)", marginBottom: 9 }}>Dimensions</div>
              <DimensionBars dims={dims} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: "var(--score-danger-soft)", border: "1px solid rgba(229,72,77,.22)", borderRadius: 12, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: "var(--score-danger)" }}><Icon name="alert-triangle" size={12} color="var(--score-danger)" /> Null spike</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--score-danger)", opacity: .8, marginTop: 2 }}>phone · 12.4%</div>
              </div>
              <div style={{ flex: 1, background: "var(--green-soft)", border: "1px solid rgba(19,185,129,.22)", borderRadius: 12, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: "var(--green-bright)" }}><Icon name="shield-check" size={12} color="var(--green-bright)" /> PII found</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--green-bright)", opacity: .8, marginTop: 2 }}>email, phone</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MktHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 48 }}>
      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22, padding: "5px 6px 5px 6px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgb(0, 0, 0)", background: "rgb(255, 228, 57)", padding: "2px 8px", borderRadius: 999 }}>NEW</span>
          <span style={{ fontSize: 12.5, color: "var(--text-soft)", paddingRight: 8 }}>AI DQ rule suggestions, now built in</span>
        </div>
        <h1 className="ds-display" style={{ margin: 0 }}>
          You don't need <span className="hero-strike">expensive tools<svg className="hero-pen" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M2,11 C58,8 104,13.5 150,10.5 C200,7.5 250,13 298,9.5" /></svg></span><br />to understand your data.
        </h1>
        <p className="ds-lead" style={{ maxWidth: 600, margin: "24px auto 0" }}>
          Know exactly where your data is broken. Get instant data-quality insights in your browser — no setup, no code, no months-long onboarding.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
          <Button variant="primary" size="lg" iconRight="arrow-right" style={{ background: "rgb(42, 42, 46)" }}>Get started free</Button>
          <Button variant="outline" size="lg" icon="play">Watch demo</Button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          {["No credit card", "Free forever for solo", "Data stays in your browser"].map((t) => (
            <span key={t} style={{ fontSize: 12, fontWeight: 500, color: "var(--text-mute)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="check" size={13} color="var(--green-bright)" /> {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", maxWidth: 920, margin: "46px auto 0", padding: "0 24px" }}>
        <HeroMock />
      </div>
    </section>
  );
}

Object.assign(window, { MktNav, MktHero });
