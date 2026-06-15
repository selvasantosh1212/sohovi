"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    company: "FinTech Startup",
    quote: "We used to spend Monday mornings manually reviewing CRM exports before any reporting could start. Sohovi reduced that to a five-minute check. The PII detection flag alone prevented a compliance incident we never saw coming.",
    stars: 5,
    initials: "PS",
    avatarBg: "var(--lavender)",
    avatarColor: "var(--ink)",
    highlight: "Cut manual data checking from 3 hours to 5 minutes",
  },
  {
    name: "Marcus Webb",
    role: "Freelance Data Consultant",
    company: "Independent",
    quote: "The AI DQ Rule suggestions are genuinely impressive. It flagged that my postal_code column had mixed formats — a problem that had been silently affecting address matching for months. My clients now ask for a Sohovi DQ report with every delivery.",
    stars: 5,
    initials: "MW",
    avatarBg: "var(--terracotta-soft)",
    avatarColor: "var(--terracotta-deep)",
    highlight: "Caught a format inconsistency clients hadn't noticed for months",
  },
  {
    name: "Kavita Nair",
    role: "Operations Lead",
    company: "E-commerce",
    quote: "The deciding factor was knowing our customer data stays on our machine. Legal reviewed the architecture and approved it in a single day. The DQ score trend chart has become part of our weekly ops review.",
    stars: 5,
    initials: "KN",
    avatarBg: "var(--sage)",
    avatarColor: "#2D6A4F",
    highlight: "Legal approved it in one day — zero compliance concerns",
  },
  {
    name: "James Okonkwo",
    role: "Data Engineer",
    company: "Healthcare SaaS",
    quote: "We were paying for a legacy DQ platform that required a dedicated ops engineer just to keep running. Sohovi covers 90% of what we actually used, runs without any maintenance, and the ROI conversation took about thirty seconds.",
    stars: 5,
    initials: "JO",
    avatarBg: "var(--butter)",
    avatarColor: "var(--ink)",
    highlight: "Replaced a legacy DQ tool for a fraction of the cost",
  },
  {
    name: "Sophie Leclerc",
    role: "Business Intelligence Lead",
    company: "Retail Group",
    quote: "I spent half a year evaluating enterprise DQ platforms — the procurement process alone was exhausting. Sohovi I had running in ten minutes. My first quality report was done before I finished my coffee.",
    stars: 5,
    initials: "SL",
    avatarBg: "var(--sky)",
    avatarColor: "var(--ink)",
    highlight: "Running in 10 minutes, first DQ report done before lunch",
  },
  {
    name: "Raj Patel",
    role: "Senior Data Analyst",
    company: "Logistics",
    quote: "The consistency scoring caught a column alignment bug in our warehouse export that had been silently corrupting downstream reports for three months. That single catch justified years of Sohovi fees. We run it on every export now.",
    stars: 5,
    initials: "RP",
    avatarBg: "var(--lavender)",
    avatarColor: "var(--ink)",
    highlight: "Found a 3-month-old data corruption bug in the first run",
  },
];

export function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(testimonials.length / 3);
  const visible = testimonials.slice(page * 3, page * 3 + 3);

  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#5B5B63" }}>
            Customer Stories
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Teams that ship cleaner data with Sohovi.
          </h2>
          <p className="text-lg" style={{ color: "#5B5B63" }}>
            From freelance consultants to 50-person data teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {visible.map((t) => (
            <div
              key={t.name}
              className="rounded-[24px] p-7 flex flex-col gap-5"
              style={{
                background: "#fff",
                border: "1px solid #E9E9EC",
                boxShadow: "0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)",
              }}
            >
              {/* Highlight callout */}
              <div className="rounded-[14px] px-4 py-3 text-sm font-medium" style={{ background: "#F4F4F5", color: "#5B5B63", border: "1px solid #E9E9EC" }}>
                &ldquo;{t.highlight}&rdquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="leading-relaxed flex-1 text-sm" style={{ color: "#5B5B63" }}>&ldquo;{t.quote}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                  style={{ background: t.avatarBg, color: t.avatarColor }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#0A0A0A" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "#5B5B63" }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
            style={{ border: "1px solid #DBDBDF", background: "#fff" }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#5B5B63" }} />
          </button>
          <span className="text-sm font-medium" style={{ color: "#5B5B63" }}>
            0{page + 1} / 0{pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
            style={{ border: "1px solid #DBDBDF", background: "#fff" }}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" style={{ color: "#5B5B63" }} />
          </button>
        </div>
      </div>
    </section>
  );
}
