"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SoftCTAProps {
  text: string;
  href?: string;
}

export function SoftCTA({ text, href = "/sign-up" }: SoftCTAProps) {
  return (
    <div className="flex justify-center my-6">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full transition-all"
        style={{
          background: "rgba(0,201,167,0.1)",
          color: "#007A65",
          border: "1px solid rgba(0,201,167,0.25)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,201,167,0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,201,167,0.1)";
        }}
      >
        {text}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
