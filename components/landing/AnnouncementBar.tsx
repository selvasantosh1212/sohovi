import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div
      className="w-full py-[9px] text-center text-[13px] font-medium border-b"
      style={{ background: "rgb(54, 53, 51)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}
    >
      <span>✦ Free data quality checks — no upload, no signup required.</span>
      <Link
        href="/#how-it-works"
        className="ml-3 font-semibold underline underline-offset-[3px] transition-opacity hover:opacity-80"
        style={{ color: "var(--terracotta-soft)" }}
      >
        See how it works →
      </Link>
    </div>
  );
}
