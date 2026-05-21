"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, X, Rocket } from "lucide-react";

const STORAGE_KEY = "sohovi_onboarding_v1_dismissed";

interface Step {
  id: string;
  label: string;
  href: string;
  done: boolean;
}

interface OnboardingChecklistProps {
  hasBusinessUnit: boolean;
  hasAsset: boolean;
  hasRun: boolean;
}

export function OnboardingChecklist({
  hasBusinessUnit,
  hasAsset,
  hasRun,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
    setMounted(true);
  }, []);

  const steps: Step[] = [
    {
      id: "bu",
      label: "Create your first Business Unit",
      href: "/dashboard/business-units/new",
      done: hasBusinessUnit,
    },
    {
      id: "asset",
      label: "Add a Data Asset",
      href: "/dashboard/assets/new",
      done: hasAsset,
    },
    {
      id: "upload",
      label: "Upload a file and profile it",
      href: "/dashboard/assets",
      done: hasRun,
    },
    {
      id: "dq",
      label: "Run your first DQ check",
      href: "/dashboard/assets",
      done: hasRun,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  // Don't render until mounted (avoid hydration flash) or if done/dismissed
  if (!mounted || dismissed || allDone) return null;

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div
      className="rounded-xl border p-5 relative"
      style={{
        background: "rgba(0,201,167,0.04)",
        borderColor: "rgba(0,201,167,0.25)",
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Dismiss getting started guide"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,201,167,0.15)" }}
        >
          <Rocket className="w-4 h-4" style={{ color: "#00C9A7" }} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Get started — {completedCount}/{steps.length} steps complete
          </h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-slate-200 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: "#00C9A7" }}
        />
      </div>

      {/* Steps */}
      <ul className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2.5">
            {step.done ? (
              <CheckCircle2
                className="w-4 h-4 shrink-0"
                style={{ color: "#00C9A7" }}
              />
            ) : (
              <Circle className="w-4 h-4 shrink-0 text-slate-300" />
            )}
            {step.done ? (
              <span className="text-sm text-slate-400 line-through">
                {step.label}
              </span>
            ) : (
              <Link
                href={step.href}
                className="text-sm text-slate-700 hover:underline font-medium"
              >
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
