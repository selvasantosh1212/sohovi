import { Rocket, GitPullRequest, Code, BadgeDollarSign, Edit3, Send, DollarSign, Megaphone, Globe, Code2, Mail, Sparkles } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ShipNotesMockup } from "@/components/labs/mockups/ShipNotesMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#00876F";

export function ShipNotesClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Rocket}
        eyebrowText="For indie SaaS founders"
        ctaLabel="Let's Build ShipNotes"
        headline={
          <>
            You <span style={{ color: ACCENT }}>stopped writing changelogs</span> months ago.
          </>
        }
        subheadline={
          <>
            ShipNotes turns your GitHub releases into a beautiful, embeddable changelog — <strong style={{ color: "#1A1A2E" }}>auto-drafted</strong>, still
            entirely yours to edit.
          </>
        }
        trustBullets={[
          { icon: GitPullRequest, text: "Auto-drafted from PRs" },
          { icon: Code, text: "Under 5KB widget" },
          { icon: BadgeDollarSign, text: "Free to start" },
        ]}
        mockup={<ShipNotesMockup accent={ACCENT} />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From merged PR to published changelog in minutes"
        intro="The GitHub App does the tedious first draft. You just humanize it and hit publish."
        steps={[
          { num: "01", icon: GitPullRequest, title: "Connect GitHub", body: "The ShipNotes app reads merged PRs and releases from your repo — no CI changes, no webhooks to wire up yourself." },
          { num: "02", icon: Edit3, title: "Humanize the draft", body: "Auto-drafted entries land in a markdown editor with tags, date, and media embed — you polish, you decide what's public." },
          { num: "03", icon: Send, title: "Publish everywhere", body: "One publish updates your hosted changelog page, the embeddable widget, and emails subscribers automatically." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Changelogs are the first thing founders cut"
        intro={'Beamer and Canny bundle changelogs into $50-100+/mo suites built for mid-size product teams — overkill for a solo founder who just wants a clean "what\'s new" page.'}
        pains={[
          { icon: Edit3, title: "Writing changelogs is tedious", body: "So most founders skip it — and quietly lose a retention and marketing channel that costs nothing but a few minutes." },
          { icon: DollarSign, title: "Beamer and Canny price for teams, not indies", body: "$50-100+/month for a changelog widget is a hard sell when you're pre-revenue or just past it." },
          { icon: Megaphone, title: "Users don't know what shipped", body: "Without a visible changelog, your best new features go unnoticed — you built it, but nobody adopted it." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="What ShipNotes actually does"
        intro="A focused changelog tool that turns shipped work into free, ongoing marketing — without becoming a whole product-feedback suite."
        features={[
          { icon: Edit3, title: "Markdown changelog editor", body: "Title, tags, date, media embed — a clean writing surface with no bloat." },
          { icon: Globe, title: "Hosted changelog page", body: "yourproduct.shipnotes.app, custom domain on paid plan — fast and built to rank in search." },
          { icon: Code2, title: "Embeddable widget", body: "Under 5KB with unread-dot logic — drops into any site without weighing it down." },
          { icon: Mail, title: "Email subscribers", body: "Notified automatically on every publish — no separate newsletter tool needed." },
          { icon: GitPullRequest, title: "GitHub-drafted entries", body: "The app drafts an entry from your merged PRs — you just humanize it." },
          { icon: Sparkles, title: "Optional BYOK AI polish", body: "Use your own OpenAI, Anthropic, or Gemini key — $0 extra to us." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="ShipNotes"
        headline="ShipNotes vs. Beamer / Canny"
        intro="The free tier carries a small 'Powered by ShipNotes' badge — the same growth loop that took the testimonial tool Senja to $1M ARR."
        competitorLabel="Beamer / Canny"
        rows={[
          { feature: "Price", us: "Free to start, then $15/mo", them: "$50–100+/mo" },
          { feature: "Draft generation", us: "Auto-drafted from GitHub releases/PRs", them: "Manual entry" },
          { feature: "AI polish", us: "Optional, your own API key — $0 extra to us", them: "Bundled AI, if any, at a higher tier" },
          { feature: "Built for", us: "Solo founders & small teams", them: "Mid-size product teams" },
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        intro="The free tier exists to spread the badge — it stays genuinely useful, not crippled."
        plans={[
          { name: "Free", price: "$0", tagline: "For your first changelog", features: ["1 project", "shipnotes.app subdomain", "Badge required"] },
          { name: "Pro", price: "$15", period: "/mo", tagline: "For your own domain", features: ["Custom domain", "Email subscribers", "GitHub drafts"], highlight: true, badge: "Most Popular" },
          { name: "Team", price: "$29", period: "/mo", tagline: "For multiple products", features: ["5 projects", "Everything in Pro"] },
        ]}
        footnote="The first 30 signups get 6 months of Pro free once ShipNotes ships."
      />

      <FeedbackForm
        toolSlug="shipnotes"
        toolName="ShipNotes"
        accent={ACCENT}
        ctaLabel="Let's Build ShipNotes"
        waitlistHeadline="Want ShipNotes to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when ShipNotes exists."
        emailPlaceholder="you@indie.dev"
        step1Field={{
          kind: "pills",
          key: "byok",
          label: "Would you use your own AI key to auto-draft entries?",
          options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No, I'll write it myself" }, { value: "unsure", label: "Not sure what that means" }],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "text", key: "howSolveToday", label: "Do you publish a changelog today, and where?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/shipnotes"
          items={[
            { q: "Is ShipNotes live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough founders want this, we'll build it next and email everyone who signed up." },
            { q: "What does 'BYOK AI' mean, and is it required?", a: "Bring-your-own-key: you can optionally paste your own OpenAI, Anthropic, or Gemini API key to have entries auto-drafted in a friendly tone. It's entirely optional — the core editor, hosted page, and widget need no AI at all." },
            { q: "Will the embeddable widget slow down my site?", a: "It's built as a dependency-free, shadow-DOM-isolated script under 5KB, designed specifically to avoid conflicting with or slowing down the host page." },
            { q: "Can I migrate my existing changelog from Notion or Beamer?", a: "That's the plan for early users — a concierge migration so switching costs you nothing but a few minutes." },
            { q: "Does the free plan really stay free forever?", a: "Yes. The trade-off is a small 'Powered by ShipNotes' badge on your public changelog page, not a feature cap that forces an upgrade." },
            { q: "What if I don't use GitHub?", a: "The auto-draft feature reads GitHub releases and merged PRs, so it needs a GitHub repo to work. The markdown editor, hosted page, and widget all work fine on their own without it — GitLab/Bitbucket auto-draft support would depend on demand." },
            { q: "Can I use this alongside my existing blog?", a: "Yes — a changelog and a blog serve different purposes (what shipped vs. longer-form writing) and commonly live side by side, often cross-linked to each other." },
            { q: "Does a public changelog page actually help with SEO?", a: 'Yes — a fast, indexable changelog page tends to rank for "[your product] changelog" and "what\'s new in [your product]" searches, which is free, ongoing marketing you don\'t have to write separately.' },
            { q: "How much does ShipNotes cost?", a: "Free for one project with the ShipNotes badge. Pro is a planned $15/month for a custom domain, email subscribers, and GitHub-drafted entries. Team is $29/month for up to 5 projects." },
            { q: "Can I filter out noisy or internal PRs from the auto-drafted entries?", a: "Yes — the plan is to draft from PRs/releases you choose (e.g. by label or branch), not every merged PR, so internal chores and refactors don't need to be manually deleted from every draft." },
            { q: "Can I schedule an entry to publish later instead of immediately?", a: "Scheduled publishing is planned, so you can line up a changelog entry with a launch or announcement instead of it going live the moment you finish writing it." },
            { q: "If I have staging and production repos, will draft entries leak early?", a: "Entries stay as private drafts until you hit publish, regardless of which environment triggered the GitHub release — nothing reaches the public page or widget until you approve it." },
          ]}
        />
      </div>
    </>
  );
}
