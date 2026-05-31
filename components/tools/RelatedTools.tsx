import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedTool {
  name: string;
  href: string;
  description: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) return null;
  return (
    <section className="mt-14">
      <h2 className="text-[18px] font-bold mb-5" style={{ color: "var(--ink)" }}>
        Related free tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all"
            style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--mint)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,201,167,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--hair-strong)";
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--paper)";
            }}
          >
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>{t.name}</p>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--ink-mute)" }}>{t.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--ink-mute)" }} />
          </Link>
        ))}
      </div>
    </section>
  );
}
