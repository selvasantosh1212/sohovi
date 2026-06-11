import { Play, Clock } from "lucide-react";

export type VideoEntry = {
  num: number;
  title: string;
  duration: string;
  description: string;
};

export const VIDEO_TUTORIALS: VideoEntry[] = [
  { num: 1, title: "Getting Started: Org Setup", duration: "~4 min", description: "Create an org, invite members, and build your Business Unit → Catalog → Asset hierarchy." },
  { num: 2, title: "Connecting Your Data", duration: "~5 min", description: "Upload CSV/Excel files and connect Google Sheets, Airtable, Cloud Storage, and REST APIs." },
  { num: 3, title: "Understanding Data Profiling", duration: "~4 min", description: "Walk through the Profile tab — types, null rates, PII detection, outliers, and value distributions." },
  { num: 4, title: "Building Data Quality Rules", duration: "~6 min", description: "Add completeness, accuracy, validity, uniqueness rules, use AI suggestions, and tune thresholds." },
  { num: 5, title: "Running Checks & Reading Scores", duration: "~5 min", description: "Run DQ checks, read the score gauge, explore column scores, failed records, and score transparency." },
  { num: 6, title: "Alerts & Monitoring", duration: "~3 min", description: "Create score-drop and schema-change alerts, manage workflows, and read alert events." },
  { num: 7, title: "Remediation & Reporting", duration: "~3 min", description: "Review failed records, export cleaned files, and generate PDF/Excel DQ reports." },
  { num: 8, title: "AI Rule Builder", duration: "~3 min", description: "Describe what your column must satisfy in plain English — Sohovi generates the exact DQ rules for you instantly." },
  { num: 9, title: "Behavioral Scoring & Data Drift Detection", duration: "~4 min", description: "See how Sohovi automatically compares runs, flags statistical anomalies, and catches distribution shifts without writing rules." },
];

interface VideoCardProps {
  video: VideoEntry;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-sm transition-all duration-150">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={`/assets/video-thumbs/thumb-${String(video.num).padStart(2, "0")}.webp`}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 text-slate-400 ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded">
          Video {video.num}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
        <div className="absolute bottom-2 left-2 bg-[#00C9A7] text-white text-xs font-semibold px-2 py-0.5 rounded">
          Coming Soon
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#00C9A7] transition-colors">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
}
