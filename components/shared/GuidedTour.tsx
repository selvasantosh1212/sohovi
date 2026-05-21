"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Building2,
  UploadCloud,
  ScanLine,
  ShieldCheck,
  Bell,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type TourStep = {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
};

const TOUR_STEPS: TourStep[] = [
  {
    icon: Sparkles,
    iconBg: "bg-[#00C9A7]",
    title: "Welcome to Sohovi",
    description:
      "Sohovi helps you measure, monitor, and continuously improve your data quality — from a single file to your entire data catalog. This quick tour covers the 6 key areas of the platform.",
  },
  {
    icon: Building2,
    iconBg: "bg-blue-500",
    title: "Organize Your Data",
    description:
      "Structure your work using Business Units → Catalogs → Data Assets. This mirrors your real org chart and lets every team own and manage their data quality independently.",
    link: { label: "Go to Business Units →", href: "/dashboard/business-units" },
  },
  {
    icon: UploadCloud,
    iconBg: "bg-violet-500",
    title: "Connect Your Data",
    description:
      "Upload CSV or Excel files, or connect live sources: Google Sheets, Airtable, Amazon S3/Azure/GCS pre-signed URLs, or any REST API. All parsing happens in your browser — your raw data never leaves your machine.",
    link: { label: "View Data Assets →", href: "/dashboard/assets" },
  },
  {
    icon: ScanLine,
    iconBg: "bg-amber-500",
    title: "Profile Your Data",
    description:
      "After every upload, Sohovi automatically profiles each column — inferred types, null rates, unique counts, value distributions, PII detection (email, phone, SSN), and outliers. No setup needed.",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-rose-500",
    title: "Define Quality Rules",
    description:
      "Add rules across 10 quality dimensions: Completeness, Accuracy, Validity, Uniqueness, Consistency, Integrity, Timeliness, Currency, Conformity, and Precision. Use AI suggestions to get started instantly.",
  },
  {
    icon: Bell,
    iconBg: "bg-cyan-500",
    title: "Monitor with Alerts",
    description:
      "Set alerts for score drops, schema changes, rule failures, or anomaly detection. Get notified via the in-app bell icon whenever something needs your attention.",
    link: { label: "Manage Alerts →", href: "/dashboard/alerts" },
  },
  {
    icon: GraduationCap,
    iconBg: "bg-[#00C9A7]",
    title: "You're Ready to Go!",
    description:
      "The Learn Center has step-by-step guides for every feature — from adding your first completeness rule to exporting DQ reports. Video tutorials are coming soon.",
    link: { label: "Open Learn Center →", href: "/dashboard/learn" },
  },
];

export function GuidedTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const current = TOUR_STEPS[step];
  const Icon = current.icon;
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  function reset() {
    setStep(0);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => { setStep(0); setOpen(true); }}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="Open guided tour"
        title="Guided tour"
      >
        <HelpCircle className="w-4.5 h-4.5" style={{ width: "1.125rem", height: "1.125rem" }} />
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); else setOpen(true); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden gap-0">
          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((step + 1) / TOUR_STEPS.length) * 100}%`,
                background: "#00C9A7",
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.iconBg}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={reset}
                className="text-slate-300 hover:text-slate-500 transition-colors"
                aria-label="Close tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <DialogTitle className="text-base font-bold text-slate-800 mb-2">
              {current.title}
            </DialogTitle>
            <p className="text-sm text-slate-500 leading-relaxed">{current.description}</p>

            {current.link && (
              <Link
                href={current.link.href}
                onClick={reset}
                className="inline-block mt-4 text-sm font-medium text-[#00C9A7] hover:underline"
              >
                {current.link.label}
              </Link>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
            <span className="text-xs text-slate-400">
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={isFirst}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-500 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
              {isLast ? (
                <button
                  onClick={reset}
                  className="px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: "#00C9A7" }}
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: "#00C9A7" }}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
