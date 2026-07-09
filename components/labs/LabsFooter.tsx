import Link from "next/link";

export function LabsFooter() {
  return (
    <footer style={{ borderTop: "1px solid #E2E8F0", background: "#FFFFFF" }}>
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "36px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
          An early-stage concept from the{" "}
          <a href="https://sohovi.com" style={{ color: "#1A1A2E", fontWeight: 600 }}>
            Sohovi
          </a>{" "}
          team — not a live product yet.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "13px" }}>
          <Link href="/privacy" style={{ color: "#64748B" }}>
            Privacy
          </Link>
          <Link href="/terms" style={{ color: "#64748B" }}>
            Terms
          </Link>
          <a href="mailto:hello@sohovi.com" style={{ color: "#64748B" }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
