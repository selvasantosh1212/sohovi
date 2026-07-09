import { LabsFooter } from "@/components/labs/LabsFooter";
import { LabsKeyframes } from "@/components/labs/LabsKeyframes";

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC", color: "#1A1A2E" }}>
      <LabsKeyframes />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#1A1A2E] font-semibold px-4 py-2 rounded-lg shadow"
      >
        Skip to main content
      </a>
      <main id="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <LabsFooter />
    </div>
  );
}
