"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(end: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, trigger]);
  return count;
}

const stats = [
  { end: 10, prefix: "", suffix: "", label: "ISO-standard quality dimensions" },
  { end: 30, prefix: "<", suffix: " sec", label: "From upload to first score" },
  { end: 0, prefix: "", suffix: " bytes", label: "Data sent to any server" },
  { end: 0, prefix: "$", suffix: "", label: "To get started" },
];

function StatItem({
  end, prefix, suffix, label, trigger,
}: { end: number; prefix: string; suffix: string; label: string; trigger: boolean }) {
  const count = useCountUp(end, 1600, trigger);
  return (
    <div className="flex flex-col items-center text-center px-6 py-10">
      <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 max-w-[160px] leading-snug font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--ink-mute)" }}>{label}</div>
    </div>
  );
}

export function ProofStrip() {
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y" style={{ background: "var(--cream-deep)", borderColor: "var(--hair)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="relative">
              {i > 0 && (
                <div className="absolute left-0 top-6 bottom-6 hidden md:block" style={{ width: "1px", background: "repeating-linear-gradient(to bottom, var(--hair-strong) 0, var(--hair-strong) 4px, transparent 4px, transparent 8px)" }} />
              )}
              <StatItem {...s} trigger={triggered} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
