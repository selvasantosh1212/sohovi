"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle, ShieldCheck, Zap } from "lucide-react";
import { SampleDataButton } from "./SampleDataButton";

const ACCEPTED_EXT = [".csv", ".xlsx", ".xls", ".ods", ".xlsm"];
const MAX_SIZE_BYTES = 200 * 1024 * 1024;

const featureCards = [
  {
    icon: ShieldCheck,
    iconColor: "#C96040",
    label: "100% client-side",
    sub: "Zero bytes uploaded",
    bg: "#FFF4EB",
  },
  {
    icon: Zap,
    iconColor: "#0F766E",
    label: "AI Rule Detector",
    sub: "Rules suggested in seconds",
    bg: "#E3F6F1",
  },
  {
    icon: FileText,
    iconColor: "#6B4FA0",
    label: "DQ Score in 30s",
    sub: "Drag to insight, fast",
    bg: "#F0E8FF",
  },
];

interface FileDropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function FileDropZone({ onFile, disabled }: FileDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXT.includes(ext))
      return `File type not supported. Please upload: ${ACCEPTED_EXT.join(", ")}`;
    if (file.size > MAX_SIZE_BYTES)
      return `File is too large (${(file.size / 1024 / 1024).toFixed(0)} MB). Max 200 MB.`;
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setFileError(err);
        return;
      }
      setFileError(null);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload file — click to browse or drag and drop"
        className={[
          "relative flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-[72px_24px] cursor-pointer transition-all duration-200 overflow-hidden",
          dragActive ? "border-[#E07150]" : "border-slate-200 hover:border-slate-300",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        style={{
          background: dragActive
            ? "radial-gradient(ellipse 80% 100% at 50% 50%, #FFEAD9, #fff)"
            : undefined,
        }}
        onClick={openFilePicker}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openFilePicker(); }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        {/* Soft halo when idle */}
        {!dragActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,234,217,0.6), transparent 70%)",
            }}
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT.join(",")}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
          tabIndex={-1}
        />

        <div className="relative text-center">
          <div
            className="w-[72px] h-[72px] rounded-[20px] inline-flex items-center justify-center mb-[22px]"
            style={{ background: "#0A0A0F" }}
          >
            <UploadCloud className="w-[26px] h-[26px] text-white" />
          </div>
          <h3
            className="text-[22px] font-bold m-0 mb-2"
            style={{ letterSpacing: "-0.02em", color: "#0A0A0F" }}
          >
            {dragActive ? "Drop your file here" : "Drop your file here"}
          </h3>
          <p className="text-[14px] text-slate-500 mb-[22px]">
            or{" "}
            <span className="font-semibold underline underline-offset-[3px]" style={{ color: "#0A0A0F" }}>
              browse your computer
            </span>
          </p>
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[12px] font-medium text-slate-500"
            style={{ background: "#F1F5F9" }}
          >
            .csv · .xlsx · .xls · up to 200 MB
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-3">
        {featureCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="p-4 rounded-xl border"
              style={{ background: c.bg, borderColor: "rgba(10,10,15,0.04)" }}
            >
              <Icon className="w-4 h-4 mb-2" style={{ color: c.iconColor }} />
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{c.label}</p>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: c.iconColor }}>
                {c.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sample data shortcut */}
      {!disabled && <SampleDataButton onFileSelect={onFile} />}

      {fileError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {fileError}
        </div>
      )}
    </div>
  );
}
