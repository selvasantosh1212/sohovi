"use client";

import Script from "next/script";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

interface ToolFAQProps {
  items: FAQItem[];
  toolUrl: string;
}

export function ToolFAQ({ items, toolUrl }: ToolFAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Script
        id={`faq-schema-${toolUrl.replace(/\//g, "-")}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-6" style={{ color: "var(--ink)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}
            >
              <button
                className="w-full text-left flex items-center justify-between gap-4 px-5 py-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                  {item.q}
                </span>
                <ChevronDown
                  className="w-4 h-4 shrink-0 transition-transform"
                  style={{
                    color: "var(--ink-mute)",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <div
                className="px-5 pb-4 text-[13px] leading-relaxed"
                style={{ color: "var(--ink-soft)", display: open === i ? "block" : "none" }}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
