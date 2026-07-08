import { Edit3, DollarSign, Megaphone } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#00876F";

export function ShipNotesClient() {
  return (
    <>
      <LabsHero
        eyebrow="For indie SaaS founders"
        accent={ACCENT}
        ctaLabel="Let's build ShipNotes"
        headline={
          <>
            You <span style={{ color: ACCENT }}>stopped writing changelogs</span> months ago.
          </>
        }
        subheadline="ShipNotes turns your GitHub releases into a beautiful, embeddable changelog — auto-drafted, still entirely yours to edit."
      />

      <PainPointSection
        headline="Changelogs are the first thing founders cut"
        intro="Beamer and Canny bundle changelogs into $50-100+/mo suites built for mid-size product teams — overkill for a solo founder who just wants a clean 'what's new' page."
        pains={[
          {
            icon: Edit3,
            title: "Writing changelogs is tedious",
            body: "So most founders skip it — and quietly lose a retention and marketing channel that costs nothing but a few minutes.",
          },
          {
            icon: DollarSign,
            title: "Beamer and Canny price for teams, not indies",
            body: "$50-100+/month for a changelog widget is a hard sell when you're pre-revenue or just past it.",
          },
          {
            icon: Megaphone,
            title: "Users don't know what shipped",
            body: "Without a visible changelog, your best new features go unnoticed — you built it, but nobody adopted it.",
          },
        ]}
      />

      <ComparisonSection
        toolName="ShipNotes"
        competitorLabel="Beamer / Canny"
        accent={ACCENT}
        rows={[
          { feature: "Price", us: "Free to start, then $15/mo", them: "$50–100+/mo" },
          { feature: "Draft generation", us: "Auto-drafted from GitHub releases/PRs", them: "Manual entry" },
          { feature: "AI polish", us: "Optional, your own API key — $0 extra to us", them: "Bundled AI, if any, at a higher tier" },
          { feature: "Built for", us: "Solo founders & small teams", them: "Mid-size product teams" },
        ]}
        note="The free tier carries a small 'Powered by ShipNotes' badge — the same growth loop that took the testimonial tool Senja to $1M ARR."
      />

      <SolutionSection
        headline="What ShipNotes actually does"
        accent={ACCENT}
        bullets={[
          "Markdown changelog editor — title, tags, date, media embed",
          "Hosted changelog page: yourproduct.shipnotes.app, custom domain on paid plan — fast and built to rank for \"[your product] changelog\" searches, free marketing you don't have to write",
          "Embeddable 'What's new' widget under 5KB, with unread-dot logic",
          "Email subscribers automatically on every publish",
          "GitHub App drafts an entry from your merged PRs — you just humanize it",
          "Optional BYOK AI polish using your own OpenAI, Anthropic, or Gemini key",
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        note="The free tier exists to spread the badge — it stays genuinely useful, not crippled."
        plans={[
          { name: "Free", price: "$0", features: ["1 project", "shipnotes.app subdomain", "Badge required"] },
          { name: "Pro", price: "$15", period: "/mo", features: ["Custom domain", "Email subscribers", "GitHub drafts"], highlight: true },
          { name: "Team", price: "$29", period: "/mo", features: ["5 projects", "Everything in Pro"] },
        ]}
      />

      <FeedbackForm
        toolSlug="shipnotes"
        toolName="ShipNotes"
        accent={ACCENT}
        ctaLabel="Let's build ShipNotes"
        questions={[
          { key: "has_changelog", label: "Do you publish a changelog today, and where?", type: "text" },
          {
            key: "byok_interest",
            label: "Would you use your own AI key to auto-draft entries?",
            type: "select",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No, I'd rather write it myself" },
              { value: "unsure", label: "Interested, but not sure what that means" },
            ],
          },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/shipnotes"
          items={[
            {
              q: "Is ShipNotes live yet?",
              a: "Not yet — this page exists to gauge interest before we build it. If enough founders want this, we'll build it next and email everyone who signed up.",
            },
            {
              q: "What does 'BYOK AI' mean, and is it required?",
              a: "Bring-your-own-key: you can optionally paste your own OpenAI, Anthropic, or Gemini API key to have entries auto-drafted in a friendly tone. It's entirely optional — the core editor, hosted page, and widget need no AI at all.",
            },
            {
              q: "Will the embeddable widget slow down my site?",
              a: "It's built as a dependency-free, shadow-DOM-isolated script under 5KB, designed specifically to avoid conflicting with or slowing down the host page.",
            },
            {
              q: "Can I migrate my existing changelog from Notion or Beamer?",
              a: "That's the plan for early users — a concierge migration so switching costs you nothing but a few minutes.",
            },
            {
              q: "Does the free plan really stay free forever?",
              a: "Yes. The trade-off is a small 'Powered by ShipNotes' badge on your public changelog page, not a feature cap that forces an upgrade.",
            },
            {
              q: "What if I don't use GitHub?",
              a: "The auto-draft feature reads GitHub releases and merged PRs, so it needs a GitHub repo to work. The markdown editor, hosted page, and widget all work fine on their own without it — GitLab/Bitbucket auto-draft support would depend on demand.",
            },
            {
              q: "Can I use this alongside my existing blog?",
              a: "Yes — a changelog and a blog serve different purposes (what shipped vs. longer-form writing) and commonly live side by side, often cross-linked to each other.",
            },
            {
              q: "Does a public changelog page actually help with SEO?",
              a: "Yes — a fast, indexable changelog page tends to rank for '[your product] changelog' and \"what's new in [your product]\" searches, which is free, ongoing marketing you don't have to write separately.",
            },
            {
              q: "How much does ShipNotes cost?",
              a: "Free for one project with the ShipNotes badge. Pro is a planned $15/month for a custom domain, email subscribers, and GitHub-drafted entries. Team is $29/month for up to 5 projects.",
            },
          ]}
        />
      </div>
    </>
  );
}
