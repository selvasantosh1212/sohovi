import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsFooter } from "@/components/labs/LabsFooter";

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#0A0A0A] font-semibold px-4 py-2 rounded-lg shadow"
      >
        Skip to main content
      </a>
      <LabsHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <LabsFooter />
    </div>
  );
}
