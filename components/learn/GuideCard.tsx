"use client";

import {
  Building, Users, Building2, BookOpen, Database,
  UploadCloud, Table2, Grid, Cloud, Plug, GitCompare,
  ScanLine, BarChart2, PieChart, ShieldAlert, AlertTriangle,
  CheckSquare, Target, ShieldCheck, Fingerprint, Link, Sparkles, FlaskConical, SlidersHorizontal,
  PlayCircle, Gauge, LayoutGrid, TableProperties, Eye, GitCompareArrows,
  BellRing, Bell, BellDot, Workflow, Zap, Wrench, FileDown,
  ArrowRight, Clock,
} from "lucide-react";
import type { Guide, GuideCategory } from "@/lib/learn/guides";

const ICON_MAP: Record<string, React.ElementType> = {
  Building, Users, Building2, BookOpen, Database,
  UploadCloud, Table2, Grid, Cloud, Plug, GitCompare,
  ScanLine, BarChart2, PieChart, ShieldAlert, AlertTriangle,
  CheckSquare, Target, ShieldCheck, Fingerprint, Link, Sparkles, FlaskConical, SlidersHorizontal,
  PlayCircle, Gauge, LayoutGrid, TableProperties, Eye, GitDiff: GitCompareArrows,
  BellRing, Bell, BellDot, Workflow, Zap, Wrench, FileDown,
  GitCompareArrows,
};

interface GuideCardProps {
  guide: Guide;
  category: GuideCategory;
  onClick: (guide: Guide) => void;
}

export function GuideCard({ guide, category, onClick }: GuideCardProps) {
  const Icon = ICON_MAP[guide.icon] ?? Database;

  return (
    <button
      onClick={() => onClick(guide)}
      className="group w-full text-left rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${category.color}`}>
          <Icon className="w-4.5 h-4.5 text-white" style={{ width: "1.125rem", height: "1.125rem" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#00C9A7] transition-colors">
              {guide.title}
            </h3>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00C9A7] shrink-0 transition-colors" />
          </div>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{guide.summary}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{guide.duration}</span>
            {guide.videoRef && (
              <>
                <span className="mx-1">·</span>
                <span className="text-[#00C9A7] font-medium">Video {guide.videoRef}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
