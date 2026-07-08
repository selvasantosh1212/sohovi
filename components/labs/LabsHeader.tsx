import Link from "next/link";

export function LabsHeader() {
  return (
    <header style={{ borderBottom: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-5 flex items-center justify-between">
        <Link href="https://sohovi.com" className="inline-flex items-center gap-2">
          <span className="font-bold text-[15px]" style={{ color: "var(--ink)" }}>
            sohovi
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
            style={{ background: "var(--cream)", color: "var(--ink-soft)", border: "1px solid var(--hair-strong)" }}
          >
            Labs
          </span>
        </Link>
        <a href="https://sohovi.com" className="text-[13px] font-medium" style={{ color: "var(--ink-soft)" }}>
          sohovi.com →
        </a>
      </div>
    </header>
  );
}
