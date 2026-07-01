"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pass" | "fail";
  onClick?: () => void;
  className?: string;
}

export function StatusBadge({ status, onClick, className }: StatusBadgeProps) {
  const styles =
    status === "pass"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600";

  const classes = cn(
    "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
    styles,
    onClick && "cursor-pointer hover:opacity-75 transition-opacity",
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {status === "pass" ? "PASS" : "BREAKING"}
      </button>
    );
  }

  return <span className={classes}>{status === "pass" ? "PASS" : "BREAKING"}</span>;
}
