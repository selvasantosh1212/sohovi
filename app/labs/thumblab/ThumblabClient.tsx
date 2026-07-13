import {
  Sparkles,
  Clock,
  Wand2,
  BadgeDollarSign,
  Upload,
  LayoutGrid,
  Scissors,
  ImageOff,
  HelpCircle,
  Wallet,
  Eye,
  TrendingUp,
  Captions,
  SwatchBook,
} from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ThumblabMockup } from "@/components/labs/mockups/ThumblabMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#E63946";

export function ThumblabClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Sparkles}
        eyebrowText="For YouTube & Shorts creators"
        ctaLabel="I Want This"
        headline={
          <>
            Stop guessing which thumbnail <span style={{ color: ACCENT }}>wins</span>. See it before you upload.
          </>
        }
        subheadline={
          <>
            ThumbLab generates thumbnail variants, previews them <strong style={{ color: "#1A1A2E" }}>next to your real competitors in a simulated feed</strong>,
            and auto-crops your Shorts with captions — all before you ever hit publish.
          </>
        }
        trustBullets={[
          { icon: Clock, text: "3 variants in 60s" },
          { icon: Wand2, text: "No design skills needed" },
          { icon: BadgeDollarSign, text: "From $19/mo" },
        ]}
        mockup={<ThumblabMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From raw upload to a tested thumbnail in three steps"
        intro="No Photoshop, no hiring a designer and waiting two days. Upload your video, get variants built for your channel, and see which one actually stands out."
        steps={[
          { num: "01", icon: Upload, title: "Upload your video", body: "Drop in your raw video or an existing thumbnail idea. ThumbLab pulls the best frames and generates 3–5 title + thumbnail variants." },
          { num: "02", icon: LayoutGrid, title: "Preview against real competitors", body: "See every variant sitting inside a simulated YouTube homepage and search feed, right next to the videos it'll actually compete with." },
          { num: "03", icon: Scissors, title: "Auto-crop for Shorts & Reels", body: "Pick your winner, and ThumbLab auto-crops vertical clips with burned-in captions — ready for Shorts, Reels, and TikTok in one export." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Every upload, you're paying twice: once for a thumbnail, once for the edit."
        intro="Thumbnails and Shorts packaging are two separate recurring costs for almost every active creator — and neither one tells you if it'll actually work until the video's already live."
        pains={[
          { icon: ImageOff, title: "$10–$60 per thumbnail, every single upload", body: "Fiverr thumbnail gigs are fast, but they're a recurring line item that scales with how often you post — and turnaround is measured in hours, not seconds." },
          { icon: HelpCircle, title: "No way to know if a thumbnail will work until it's live", body: "You pick your favorite, publish, and find out from the CTR graph two days later — by then the algorithm has already decided how far the video goes." },
          { icon: Wallet, title: "A second freelancer, a second invoice, for Shorts", body: "Repackaging your long-form video into vertical clips with captions is usually a separate $30–$150 gig — on top of the thumbnail, every time." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One tool, before you publish: thumbnails, benchmarking, and Shorts — done"
        intro="ThumbLab isn't a full editing suite. It's the pre-flight check every video needs before it goes live, and the Shorts export you need right after."
        features={[
          { icon: Sparkles, title: "AI thumbnail + title variants", body: "3–5 thumbnail and title pairings generated straight from your video, built around what actually gets clicked in your niche." },
          { icon: Eye, title: "Simulated feed preview", body: "See every variant sitting inside a real YouTube homepage and search results layout, next to the exact competitor videos you're up against." },
          { icon: TrendingUp, title: "Predicted CTR scoring", body: "Each variant gets scored against your channel's own upload history, so you're picking based on signal, not a gut feeling." },
          { icon: Scissors, title: "Auto-cropped vertical clips", body: "Turn your long-form upload into 3–5 vertical Shorts/Reels clips, automatically framed around the moments that matter." },
          { icon: Captions, title: "Burned-in captions, no extra step", body: "Every auto-cropped clip ships with readable, on-brand captions already in place — no separate captioning tool required." },
          { icon: SwatchBook, title: "Brand-consistent templates", body: "Lock in your fonts, colors, and face-cutout style once, and every future variant stays on-brand automatically." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="ThumbLab"
        headline="ThumbLab vs. hiring separately for thumbnails and Shorts"
        intro="Most creators run two parallel freelance relationships — a thumbnail designer and a Shorts editor — paying per video, with no way to test before publishing."
        competitorLabel="Fiverr designer + Shorts editor"
        rows={[
          { feature: "Cost per month (4 uploads)", us: "Flat $19–$39/mo", them: "$160–$840/mo, scales with upload frequency" },
          { feature: "Turnaround", us: "Under a minute", them: "24–72 hours per gig" },
          { feature: "Pre-publish testing", us: "Simulated feed preview + CTR score", them: "None — you find out after it's live" },
          { feature: "Shorts packaging", us: "Included, auto-cropped with captions", them: "A separate gig, separate invoice" },
        ]}
        note="Channel-analytics tools like TubeBuddy and VidIQ offer thumbnail A/B testing as one feature inside a much broader toolkit — ThumbLab is built around getting a tested thumbnail and packaged Shorts out the door in one pass, not as an add-on."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free to test on your next upload, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Test it on your next video", features: ["3 thumbnail variants", "Feed preview", "1 Shorts export"] },
          { name: "Creator", price: "$19", period: "/mo", tagline: "For channels posting weekly", features: ["Unlimited variants", "CTR scoring", "Unlimited Shorts exports"], highlight: true, badge: "Early-bird $14/mo forever" },
          { name: "Studio", price: "$39", period: "/mo", tagline: "For teams & multi-channel creators", features: ["Everything in Creator", "Multiple channels", "Brand template library"] },
        ]}
        footnote="No per-video fees. No watermarks. Cancel anytime."
      />

      <FeedbackForm
        toolSlug="thumblab"
        toolName="ThumbLab"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want ThumbLab to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when ThumbLab exists."
        step1Field={{
          kind: "pills",
          key: "role",
          label: "What best describes you?",
          options: [
            { value: "solo-creator", label: "Solo creator" },
            { value: "small-team", label: "Small channel team" },
            { value: "editor-va", label: "Editor / VA for creators" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you make thumbnails and Shorts today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "uploadFrequency", label: "How often do you upload?", options: [{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "few-times-month", label: "A few times a month" }, { value: "occasionally", label: "Occasionally" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/thumblab"
          items={[
            { q: "Is ThumbLab live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough creators want this, we'll build it next and email everyone who signed up first." },
            { q: "Do I need any design skills to use it?", a: "No. You upload your video (or a rough idea), and ThumbLab generates polished, on-brand thumbnail and title variants automatically." },
            { q: "How does the feed preview work?", a: "Your generated variants are placed inside a mock-up of the YouTube homepage and search results, alongside the actual competitor videos you'd be ranking against, so you can judge them in context instead of in isolation." },
            { q: "Is the CTR score a guarantee?", a: "No — it's a prediction based on patterns from your own channel's upload history, not a guarantee of performance. It's meant to help you choose between variants, not replace real-world results." },
            { q: "Can it edit my full video, not just thumbnails and Shorts?", a: "Not in the first version. ThumbLab is deliberately scoped to the pre-publish thumbnail decision and the Shorts/Reels repackaging step — not full-length editing." },
            { q: "What video lengths and formats work?", a: "Standard long-form YouTube uploads in common formats (MP4, MOV) are the primary target — the auto-crop feature is built around pulling vertical moments out of horizontal footage." },
            { q: "How is this different from TubeBuddy or VidIQ?", a: "Those are broad channel-analytics suites with thumbnail testing as one feature among many. ThumbLab is built around a single job: generate, benchmark, and package a video for publish in one pass." },
            { q: "Can I keep my own thumbnail style?", a: "Yes — brand templates let you lock in your fonts, colors, and face-cutout style so every generated variant matches how your channel already looks." },
            { q: "What happens to my raw video after I upload it?", a: "It's used only to generate your thumbnails and clips and isn't shared, sold, or used to train anything beyond your own account's outputs. Full data-handling details will be published before launch." },
            { q: "How much will ThumbLab cost?", a: "Planned pricing starts at a free tier to test on your next upload, with paid plans from $19/month for unlimited variants and Shorts exports. Early waitlist signups lock in $14/month forever." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Does it work for niches other than YouTube, like TikTok-only creators?", a: "The core feed-preview and benchmarking feature is built around YouTube's layout first, but the Shorts/Reels export is designed to work anywhere vertical video gets posted." },
          ]}
        />
      </div>
    </>
  );
}
