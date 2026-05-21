"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Lightbulb, Video, CheckCircle2 } from "lucide-react";
import type { Guide, GuideCategory } from "@/lib/learn/guides";

interface GuideDetailSheetProps {
  guide: Guide | null;
  category: GuideCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuideDetailSheet({ guide, category, open, onOpenChange }: GuideDetailSheetProps) {
  if (!guide || !category) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: "#00C9A7" }}
            >
              {category.label}
            </span>
            <span className="text-xs text-slate-400">{guide.duration}</span>
          </div>
          <SheetTitle className="text-base font-bold text-slate-800 mt-1">{guide.title}</SheetTitle>
          <SheetDescription className="text-sm text-slate-500 mt-1">{guide.summary}</SheetDescription>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Steps */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Steps</h4>
            <ol className="space-y-3">
              {guide.steps.map((s) => (
                <li key={s.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">{s.step}</span>
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm text-slate-700">{s.action}</p>
                    {s.detail && <p className="text-xs text-slate-400 mt-0.5">{s.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Example */}
          {guide.example && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Example</span>
              </div>
              <p className="text-sm text-slate-600">{guide.example}</p>
            </div>
          )}

          {/* Tip */}
          {guide.tip && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pro Tip</span>
              </div>
              <p className="text-sm text-amber-800">{guide.tip}</p>
            </div>
          )}

          {/* Video ref */}
          {guide.videoRef && (
            <div className="rounded-lg border border-slate-200 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Video Tutorial #{guide.videoRef}</p>
                <p className="text-xs text-slate-400">Available in the Videos section of the Learn Center</p>
              </div>
              <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
