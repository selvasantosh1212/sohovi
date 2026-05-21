import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--cream)" }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#1E3A5F] font-semibold px-4 py-2 rounded-lg shadow"
      >
        Skip to main content
      </a>
      <PublicNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
