import Link from "next/link";

export function LabsFooter() {
  return (
    <footer className="mt-20" style={{ borderTop: "1px solid var(--hair)", background: "var(--paper)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-center sm:text-left" style={{ color: "var(--ink-soft)" }}>
          An early-stage concept from the{" "}
          <a href="https://sohovi.com" style={{ color: "var(--ink)", fontWeight: 600 }}>
            Sohovi
          </a>{" "}
          team — not a live product yet.
        </p>
        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--ink-soft)" }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:hello@sohovi.com">Contact</a>
        </div>
      </div>
    </footer>
  );
}
