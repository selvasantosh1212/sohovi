import {
  Bot,
  RadarIcon,
  ClipboardList,
  BadgeDollarSign,
  ListPlus,
  ScanSearch,
  LayoutDashboard,
  EyeOff,
  Users2,
  Building2,
  TrendingUp,
  Quote,
  Swords,
  FileEdit,
  Palette,
} from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { SeenlyMockup } from "@/components/labs/mockups/SeenlyMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#7C3AED";

export function SeenlyClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Bot}
        eyebrowText="For SMBs & marketing agencies"
        ctaLabel="I Want This"
        headline={
          <>
            Your customers are asking ChatGPT about you. You have <span style={{ color: ACCENT }}>no idea</span> what it says.
          </>
        }
        subheadline={
          <>
            Seenly tracks your brand across ChatGPT, Perplexity, and Google AI Overviews every week — showing
            <strong style={{ color: "#1A1A2E" }}> mention rate, sentiment, and exactly which sources the AI is citing</strong>, plus what to fix.
          </>
        }
        trustBullets={[
          { icon: RadarIcon, text: "Tracks 3 AI engines" },
          { icon: ClipboardList, text: "Weekly automated checks" },
          { icon: BadgeDollarSign, text: "From $49/mo" },
        ]}
        mockup={<SeenlyMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From zero visibility to a weekly AI-visibility report in three steps"
        intro="No manual prompt-checking, no guessing what ChatGPT says about you. Set it up once, and Seenly keeps watching."
        steps={[
          { num: "01", icon: ListPlus, title: "Enter your brand & questions", body: "Add your brand, your key competitors, and the buying questions real customers would ask — \"best [category] for [use case],\" for example." },
          { num: "02", icon: ScanSearch, title: "Seenly runs the prompts weekly", body: "Those exact questions get run against ChatGPT, Perplexity, and Google AI Overviews on a schedule — not a one-time snapshot." },
          { num: "03", icon: LayoutDashboard, title: "See your dashboard & fix suggestions", body: "Mention rate, sentiment, and cited sources land in one dashboard, along with concrete content changes to improve how AI engines describe you." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Google rankings, you can check anytime. AI answers, you can't — until now."
        intro="Search behavior has already shifted: customers increasingly ask an AI for a recommendation instead of running a Google search. Most businesses have zero visibility into whether they show up, how they're described, or where the AI is even getting its information."
        pains={[
          { icon: EyeOff, title: "No idea if you're even mentioned", body: "You can Google your own brand name any time — but you can't see what ChatGPT tells a customer who asks \"best [category] for small businesses\" unless you happen to type that exact question yourself." },
          { icon: Users2, title: "Competitors might be winning the recommendation, silently", body: "If an AI engine consistently recommends a competitor over you for the exact questions your buyers ask, you'd have no way of knowing — there's no alert, no dashboard, nothing." },
          { icon: Building2, title: "Existing tools are built for enterprise budgets", body: "The handful of AI-visibility platforms that exist today are priced and packaged for enterprise marketing teams, not the SMB or the agency managing 10 client accounts." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One dashboard: what AI says about you, why, and what to do about it"
        intro="Seenly isn't a generic SEO suite with an AI feature bolted on. It's built specifically to answer one question every week: what do ChatGPT, Perplexity, and Google's AI Overviews say when someone asks about your category?"
        features={[
          { icon: RadarIcon, title: "Multi-engine prompt tracking", body: "The same buying-intent questions run automatically across ChatGPT, Perplexity, and Google AI Overviews — not just one engine in isolation." },
          { icon: TrendingUp, title: "Mention rate & sentiment dashboard", body: "See what share of tracked prompts mention your brand, and whether the tone is positive, neutral, or unfavorable — tracked over time, not a one-off check." },
          { icon: Quote, title: "Source & citation tracking", body: "Know exactly which pages, reviews, or articles the AI is pulling from when it talks about you — so you know what's actually shaping the answer." },
          { icon: Swords, title: "Competitor benchmarking", body: "See how often competitors get mentioned for the same questions, side by side with your own numbers, not just your brand in isolation." },
          { icon: FileEdit, title: "Content-fix suggestions", body: "Get concrete, specific suggestions — not vague advice — for content changes likely to improve how AI engines cite and describe your brand." },
          { icon: Palette, title: "White-label mode for agencies", body: "Run and report AI-visibility tracking under your own agency's brand, turning this into a new billable service instead of a tool your clients see directly." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="Seenly"
        headline="Seenly vs. checking ChatGPT yourself"
        intro="The only real alternative most businesses have today is manually typing a few questions into ChatGPT every so often — which doesn't scale, isn't tracked over time, and misses Perplexity and Google AI Overviews entirely."
        competitorLabel="Manually asking ChatGPT"
        rows={[
          { feature: "Engines covered", us: "ChatGPT, Perplexity, Google AI Overviews", them: "Whichever one you remember to check" },
          { feature: "Frequency", us: "Automated, weekly, tracked over time", them: "Whenever you happen to think of it" },
          { feature: "Competitor visibility", us: "Side-by-side benchmarking built in", them: "You'd have to ask about them separately" },
          { feature: "Actionability", us: "Specific content-fix suggestions", them: "You're on your own to interpret the answer" },
        ]}
        note="Enterprise-grade AI-visibility platforms exist, but they're priced and scoped for large marketing teams — Seenly is built for SMBs and the agencies serving them."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free to track your brand on one engine, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Track one engine, one brand", features: ["1 AI engine", "5 tracked prompts", "Weekly mention check"] },
          { name: "Growth", price: "$49", period: "/mo", tagline: "For SMBs watching their category", features: ["All 3 engines", "Unlimited prompts", "Content-fix suggestions"], highlight: true, badge: "Early-bird $35/mo forever" },
          { name: "Agency", price: "$199", period: "/mo", tagline: "White-label for multiple clients", features: ["Everything in Growth", "White-label reports", "Multiple client brands"] },
        ]}
        footnote="No per-prompt fees. No 'contact sales' for a standard agency upgrade."
      />

      <FeedbackForm
        toolSlug="seenly"
        toolName="Seenly"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want Seenly to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when Seenly exists."
        step1Field={{
          kind: "pills",
          key: "role",
          label: "What best describes you?",
          options: [
            { value: "smb-owner", label: "SMB owner / marketer" },
            { value: "agency", label: "Marketing agency" },
            { value: "in-house-marketer", label: "In-house marketing team" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you check your AI visibility today, if at all?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "clientAccounts", label: "How many brands would you track?", options: [{ value: "1", label: "Just my own" }, { value: "2-5", label: "2–5 (agency clients)" }, { value: "6-plus", label: "6+ (agency clients)" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/seenly"
          items={[
            { q: "Is Seenly live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough businesses and agencies want this, we'll build it next and email everyone who signed up first." },
            { q: "Which AI engines does it track?", a: "ChatGPT, Perplexity, and Google AI Overviews are the three engines planned for launch, since together they cover the large majority of AI-driven recommendation traffic today." },
            { q: "How often does it check?", a: "Weekly by default — frequent enough to catch real shifts in how AI engines describe your brand, without generating noise from day-to-day variation in AI responses." },
            { q: "What counts as a 'mention'?", a: "Any response where your brand name is referenced in the AI's answer to a tracked prompt, whether recommended positively, mentioned neutrally, or referenced critically — sentiment is tracked separately." },
            { q: "Can I track my competitors too?", a: "Yes — competitor benchmarking against the same tracked prompts is a core part of the dashboard, not an add-on." },
            { q: "What are 'content-fix suggestions'?", a: "Specific, actionable changes to your existing content — page copy, structured data, or sourcing — that are likely to improve how AI engines cite and describe your brand, based on what's currently being cited instead." },
            { q: "Is this the same as SEO?", a: "Related, but distinct — traditional SEO optimizes for search engine rankings, while Seenly is focused specifically on how large language models describe and recommend your brand in conversational answers." },
            { q: "How does white-label mode work for agencies?", a: "Agencies can run tracking across multiple client brands and generate reports under their own branding, so this becomes a resellable service rather than a tool clients interact with directly." },
            { q: "Can AI engines' answers change between checks?", a: "Yes — LLM outputs aren't perfectly deterministic, which is exactly why tracking mention rate over multiple weekly checks matters more than any single snapshot." },
            { q: "How much will Seenly cost?", a: "Planned pricing starts at a free tier for one engine and brand, with paid plans from $49/month covering all three engines. Early waitlist signups lock in $35/month forever. Agency white-label pricing is planned at $199/month." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Do I need technical or SEO expertise to use it?", a: "No — the dashboard and content-fix suggestions are written for a business owner or marketer, not an engineer, though agencies with SEO expertise can go deeper into the source-citation data." },
          ]}
        />
      </div>
    </>
  );
}
