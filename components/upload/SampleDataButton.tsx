"use client";

import { Sparkles } from "lucide-react";
import { createSampleFile } from "@/lib/sample-data";

interface SampleDataButtonProps {
  onFileSelect: (file: File) => void;
}

export function SampleDataButton({ onFileSelect }: SampleDataButtonProps) {
  function handleClick() {
    onFileSelect(createSampleFile());
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="text-sm text-slate-400">or</span>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: "#00C9A7" }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        try with sample data
      </button>
      <span className="text-xs text-slate-400">(50 rows, real quality issues)</span>
    </div>
  );
}
