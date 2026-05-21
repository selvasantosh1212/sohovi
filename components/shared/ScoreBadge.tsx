import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function scoreColor(score: number | null | undefined): {
  bg: string;
  text: string;
  label: string;
} {
  if (score === null || score === undefined) return { bg: "bg-slate-100", text: "text-slate-400", label: "No data" };
  if (score >= 95) return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Excellent" };
  if (score >= 80) return { bg: "bg-teal-50", text: "text-teal-700", label: "Good" };
  if (score >= 60) return { bg: "bg-amber-50", text: "text-amber-700", label: "Warning" };
  return { bg: "bg-red-50", text: "text-red-700", label: "Critical" };
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const { bg, text } = scoreColor(score);
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-base px-3 py-1" : "text-sm px-2.5 py-0.5";

  return (
    <span className={cn("inline-flex items-center rounded-full font-semibold", bg, text, sizeClass, className)}>
      {score !== null && score !== undefined ? `${score}` : "—"}
    </span>
  );
}

export function ScoreBar({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) return null;
  const color = score >= 95 ? "#10B981" : score >= 80 ? "#00C9A7" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}
