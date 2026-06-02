"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface BlogSoftCTAProps {
  text: string;
  href?: string;
}

export function BlogSoftCTA({ text, href = "/sign-up" }: BlogSoftCTAProps) {
  return (
    <div className="not-prose my-8 flex justify-center">
      <Link
        href={href}
        className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-[14px] font-semibold transition-all max-w-xl text-center"
        style={{
          background: "#EDE9FE",
          color: "#5B21B6",
          border: "1px solid #C4B5FD",
          borderLeft: "3px solid #7C3AED",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#DDD6FE";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#EDE9FE";
        }}
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>{text}</span>
        <span
          className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "#7C3AED", color: "#fff" }}
        >
          Try for free
        </span>
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </Link>
    </div>
  );
}
