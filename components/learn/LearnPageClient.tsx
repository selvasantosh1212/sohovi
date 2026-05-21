"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, GraduationCap, Video } from "lucide-react";
import { GUIDE_CATEGORIES, findGuideById, type Guide, type GuideCategory } from "@/lib/learn/guides";
import { GuideCard } from "@/components/learn/GuideCard";
import { GuideDetailSheet } from "@/components/learn/GuideDetailSheet";
import { VideoCard, VIDEO_TUTORIALS } from "@/components/learn/VideoCard";

export function LearnPageClient() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Auto-open a guide from URL param ?guide=<id>
  useEffect(() => {
    const guideId = searchParams.get("guide");
    if (guideId) {
      const result = findGuideById(guideId);
      if (result) {
        setSelectedGuide(result.guide);
        setSelectedCategory(result.category);
        setSheetOpen(true);
      }
    }
  }, [searchParams]);

  function openGuide(guide: Guide) {
    const result = findGuideById(guide.id);
    if (result) {
      setSelectedGuide(result.guide);
      setSelectedCategory(result.category);
      setSheetOpen(true);
    }
  }

  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GUIDE_CATEGORIES
      .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        guides: cat.guides.filter(
          (g) =>
            !q ||
            g.title.toLowerCase().includes(q) ||
            g.summary.toLowerCase().includes(q) ||
            g.steps.some((s) => s.action.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.guides.length > 0);
  }, [query, activeCategory]);

  const totalGuides = GUIDE_CATEGORIES.reduce((sum, c) => sum + c.guides.length, 0);

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#00C9A7" }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Sohovi Learn Center</h1>
            <p className="text-sm text-slate-500">{totalGuides} step-by-step guides · 7 video tutorials coming soon</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 max-w-xl">
          Everything you need to master Sohovi — from setting up your organization to running advanced data quality rules and monitoring your data health.
        </p>

        {/* Quick start */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: "1. Create Org", id: "create-organization" },
            { label: "2. Upload Data", id: "upload-csv-excel" },
            { label: "3. Profile Data", id: "what-is-profiling" },
            { label: "4. Add Rules", id: "add-completeness-rule" },
            { label: "5. Check Score", id: "read-overall-score" },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => {
                const result = findGuideById(step.id);
                if (result) openGuide(result.guide);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#00C9A7] hover:text-[#00C9A7] transition-colors"
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides… (e.g. 'completeness', 'PII', 'alert')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]/30 focus:border-[#00C9A7]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              activeCategory === "all"
                ? "bg-[#00C9A7] text-white border-[#00C9A7]"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            All
          </button>
          {GUIDE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#00C9A7] text-white border-[#00C9A7]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No guides match &quot;{query}&quot;. Try a different keyword.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((cat) => (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{cat.label}</h2>
                <span className="text-xs text-slate-400">({cat.guides.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} category={cat} onClick={openGuide} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Video section */}
      {(!query || "video".includes(query.toLowerCase())) && activeCategory === "all" && (
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-6">
            <Video className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-700">Video Tutorials</h2>
            <span className="text-xs text-slate-400 ml-1">— 7 walkthroughs, coming soon</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {VIDEO_TUTORIALS.map((v) => (
              <VideoCard key={v.num} video={v} />
            ))}
          </div>
        </section>
      )}

      {/* Guide detail sheet */}
      <GuideDetailSheet
        guide={selectedGuide}
        category={selectedCategory}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
