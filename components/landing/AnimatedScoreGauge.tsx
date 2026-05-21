"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedScoreGauge({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const end = score;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setDisplayed(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const fraction = displayed / 100;
    const currentAngle = startAngle + fraction * (endAngle - startAngle);

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#00C9A7");
    gradient.addColorStop(1, "#10B981");
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, currentAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();
  }, [displayed]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <canvas ref={canvasRef} width={160} height={160} />
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-[#1A1A2E]">{displayed}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">DQ Score</span>
      </div>
    </div>
  );
}
