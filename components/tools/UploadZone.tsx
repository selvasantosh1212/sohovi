"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

interface UploadZoneProps {
  accept?: string;
  label?: string;
  sublabel?: string;
  onFile: (file: File) => void;
}

export function UploadZone({
  accept = ".csv,.xlsx,.xls",
  label = "Drop your CSV file here, or click to browse",
  sublabel = "CSV and Excel files supported. Your data never leaves your browser.",
  onFile,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      aria-label="Upload file"
      className="cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 py-12 px-6 text-center select-none"
      style={{
        borderColor: dragging ? "var(--mint)" : "var(--hair-strong)",
        background: dragging ? "rgba(0,201,167,0.04)" : "var(--paper)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: dragging ? "rgba(0,201,167,0.12)" : "var(--cream-deep)" }}
      >
        {dragging ? (
          <FileText className="w-6 h-6" style={{ color: "var(--mint)" }} />
        ) : (
          <Upload className="w-6 h-6" style={{ color: "var(--ink-mute)" }} />
        )}
      </div>
      <div>
        <p className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
          {label}
        </p>
        <p className="text-[13px] mt-1" style={{ color: "var(--ink-mute)" }}>
          {sublabel}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
