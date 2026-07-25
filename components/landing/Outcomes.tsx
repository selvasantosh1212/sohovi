"use client";

import { BadgeCheck, GitCompare, Lock, ShieldAlert } from "lucide-react";

const outcomes = [
  {
    icon: BadgeCheck,
    title: "A number, not a guess",
    body: "Every file gets scored, not eyeballed — so “this looks fine” turns into a number your whole team can point to.",
  },
  {
    icon: GitCompare,
    title: "Mismatches found in minutes",
    body: "See exactly where two exports disagree — no ticket filed, no engineer pulled in.",
  },
  {
    icon: Lock,
    title: "Fewer questions from legal",
    body: "Your files never leave your machine, so there’s no new vendor risk to review and no data-sharing clause to negotiate.",
  },
  {
    icon: ShieldAlert,
    title: "Small fixes, not fire drills",
    body: "A quality dip gets flagged while it’s still a two-minute fix — long before it turns into an all-hands scramble.",
  },
];

export function Outcomes() {
  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#5B5B63" }}>
            Proof, Not Promises
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Trust isn&apos;t a feeling here — it&apos;s something you can show.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {outcomes.map((o) => {
            const Icon = o.icon;
            return (
              <div
                key={o.title}
                className="rounded-[24px] p-6 space-y-4 transition-all duration-200"
                style={{
                  background: "#fff",
                  border: "1px solid #E9E9EC",
                  boxShadow: "0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 2px rgba(10,10,10,.04), 0 16px 38px -20px rgba(10,10,10,.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)"; }}
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: "rgba(55,55,107,0.1)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#37376B" }} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold" style={{ color: "#0A0A0A" }}>{o.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#5B5B63" }}>{o.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
