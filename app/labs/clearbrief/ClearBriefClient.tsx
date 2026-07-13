import {
  ClipboardCheck,
  Clock,
  Sparkles,
  BadgeDollarSign,
  ListPlus,
  Link2,
  BellRing,
  MailQuestion,
  Hourglass,
  RefreshCcw,
  LayoutTemplate,
  Gauge,
  PackageCheck,
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
import { ClearBriefMockup } from "@/components/labs/mockups/ClearBriefMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#C026D3";

export function ClearBriefClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={ClipboardCheck}
        eyebrowText="For freelancers & agencies, any niche"
        ctaLabel="I Want This"
        headline={
          <>
            The revision cycle wasn&apos;t your fault. The <span style={{ color: ACCENT }}>brief</span> was incomplete.
          </>
        }
        subheadline={
          <>
            ClearBrief builds a reusable intake checklist for whatever you do — files, copy, brand assets, access — and an
            <strong style={{ color: "#1A1A2E" }}> AI reads the completed brief and flags what&apos;s still ambiguous</strong> before you ever start work.
          </>
        }
        trustBullets={[
          { icon: Sparkles, text: "AI ambiguity checks" },
          { icon: Clock, text: "60-second setup" },
          { icon: BadgeDollarSign, text: "From $10/mo" },
        ]}
        mockup={<ClearBriefMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From a blank brief to a client-ready package in three steps"
        intro="No niche-specific software to fight with. Build a checklist for exactly what your work requires, send one link, and let the reminders and AI checks do the rest."
        steps={[
          { num: "01", icon: ListPlus, title: "Build your own checklist", body: "Files, copy, brand assets, login credentials, reference links — whatever your specific work needs. Reusable across every new client, in any niche." },
          { num: "02", icon: Link2, title: "Send one link with a progress bar", body: "Your client sees exactly what's left and fills it in from any device — no account, no login, no confusion about what's still missing." },
          { num: "03", icon: Sparkles, title: "AI flags what's still ambiguous", body: "Before you start work, ClearBrief reads the completed brief and flags gaps — \"client didn't specify dimensions\" — so you're not guessing mid-project." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Revision cycle #3 isn't a communication problem. It's a bad-brief problem."
        intro="This is the #1 friction point on both sides of the freelance economy: freelancers lose days waiting on logos, copy, and requirements, while clients blame endless revisions on briefs that were incomplete from day one."
        pains={[
          { icon: MailQuestion, title: "Waiting days for logos, copy, or passwords", body: "The project can't start — or can't finish — until a client hands over assets that are scattered across their email, their old freelancer's files, or their memory." },
          { icon: Hourglass, title: "Revisions caused by things nobody asked about", body: "\"I thought you knew I wanted it in that font\" — most revision cycles trace back to a requirement that was never actually captured in the original brief." },
          { icon: RefreshCcw, title: "Rebuilding the same intake form for every new client", body: "Freelancers either skip proper intake to save time, or rebuild a Google Form from scratch for every new project — both cost more time than they save." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One reusable system: complete briefs, in, before you ever start"
        intro="ClearBrief isn't a bloated project-management suite. It's a focused tool for one job: getting a complete, unambiguous brief out of your client before the clock starts on your work."
        features={[
          { icon: LayoutTemplate, title: "Fully custom, reusable checklists", body: "Build the exact intake checklist your niche needs — video editing, resume writing, design, VA work — and reuse it for every future client." },
          { icon: Gauge, title: "One link, a visible progress bar", body: "Clients see a simple, mobile-friendly progress bar instead of a wall of form fields — and always know exactly what's left." },
          { icon: BellRing, title: "Automatic nag reminders", body: "Scheduled reminders go out until the checklist is complete, so you're never the one sending the fourth follow-up email yourself." },
          { icon: Sparkles, title: "AI ambiguity detection", body: "The completed brief gets read automatically, flagging vague or missing answers — \"client didn't specify dimensions\" — before you've written a line of work." },
          { icon: PackageCheck, title: "A clean \"ready to start\" package", body: "Every file, answer, and asset comes packaged into one clear handoff — no more digging through five different messages to find what you need." },
          { icon: Palette, title: "Your branding, not a generic form", body: "The checklist your client sees carries your name, not a third-party tool's — it reads as part of your process, not a chore you're outsourcing." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="ClearBrief"
        headline="ClearBrief vs. Content Snare"
        intro="Content Snare proved the market for client content collection — but it's priced and built as a general business tool, not for the solo freelancer who just needs one clean brief per client."
        competitorLabel="Content Snare"
        rows={[
          { feature: "Starting price", us: "From $10/mo", them: "From ~$35/mo" },
          { feature: "Ambiguity detection", us: "AI flags incomplete or vague answers", them: "Manual review only" },
          { feature: "Built for", us: "Solo freelancers in any niche", them: "Agencies and larger businesses" },
          { feature: "Setup", us: "Build your checklist in minutes", them: "More configuration for team workflows you may not need" },
        ]}
        note="The real competitor for most freelancers is a Google Form plus a lot of follow-up emails — free, but scattered, and with no way to catch a vague answer before it becomes a revision cycle."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free for your first client, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Try it on one client", features: ["1 active brief", "Custom checklist builder", "Progress-bar link"] },
          { name: "Solo", price: "$10", period: "/mo", tagline: "For active freelancers", features: ["Unlimited briefs & clients", "AI ambiguity flagging", "Your branding"], highlight: true, badge: "Early-bird $7/mo forever" },
          { name: "Studio", price: "$40", period: "/mo", tagline: "For small agencies & teams", features: ["Everything in Solo", "Team seats", "Shared checklist templates"] },
        ]}
        footnote="No per-client fees. No per-request fees. No 'contact sales.'"
      />

      <FeedbackForm
        toolSlug="clearbrief"
        toolName="ClearBrief"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want ClearBrief to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when ClearBrief exists."
        step1Field={{
          kind: "pills",
          key: "niche",
          label: "What kind of freelance work do you do?",
          options: [
            { value: "video-audio", label: "Video / audio editing" },
            { value: "design", label: "Design" },
            { value: "writing", label: "Writing / copywriting" },
            { value: "other-freelance", label: "Other freelance work" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you collect briefs and content from clients today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "currentTool", label: "What do you use for this today?", options: [{ value: "forms-email", label: "Google Forms / email" }, { value: "content-snare", label: "Content Snare" }, { value: "dubsado-honeybook", label: "Dubsado or HoneyBook" }, { value: "other", label: "Other" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/clearbrief"
          items={[
            { q: "Is ClearBrief live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough freelancers want this, we'll build it next and email everyone who signed up first." },
            { q: "Is this only for one type of freelancer?", a: "No — the checklist builder is deliberately generic so video editors, designers, writers, VAs, and any other freelancer can build an intake checklist specific to their own work." },
            { q: "Does my client need to create an account?", a: "No. Clients open a single link and go straight to a progress-bar checklist — no login, no password, no app to download." },
            { q: "How does the AI ambiguity detection work?", a: "Once a client submits their answers, ClearBrief reads the completed brief and flags fields that are vague, contradictory, or missing a detail your work would typically need — before you start, not after a revision request." },
            { q: "Can I reuse the same checklist across clients?", a: "Yes — that's the core idea. Build a checklist once for your type of work, then reuse and tweak it for every new client instead of rebuilding intake from scratch." },
            { q: "How is this different from Content Snare?", a: "Content Snare is a broader tool built for agencies and larger teams, priced accordingly. ClearBrief is scoped and priced for the solo freelancer, and adds AI-driven ambiguity detection Content Snare doesn't have." },
            { q: "What file types can clients upload?", a: "Standard project assets — images, documents, audio, video, and common design file formats — with size limits generous enough for typical freelance handoffs." },
            { q: "What if my client ignores the checklist?", a: "ClearBrief sends automatic reminders until it's complete, and you can always see exactly what's outstanding and follow up yourself, too." },
            { q: "How much will ClearBrief cost?", a: "Planned pricing starts at a free tier for your first client, with paid plans from $10/month for unlimited briefs. Early waitlist signups lock in $7/month forever." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Can I use my own branding instead of ClearBrief's?", a: "Yes — the checklist your client sees is meant to carry your name and branding, so it reads as part of your process rather than a third-party tool." },
            { q: "Does it integrate with project management tools I already use?", a: "Not in the first version — ClearBrief is focused on the intake step itself. Exporting a completed brief's files and answers is planned, with direct integrations depending on demand." },
          ]}
        />
      </div>
    </>
  );
}
