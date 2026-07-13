import {
  HardHat,
  Smartphone,
  BadgeDollarSign,
  Pencil,
  Send,
  BellRing,
  Hourglass,
  FileWarning,
  BanknoteX,
  Eye,
  ListChecks,
  MessagesSquare,
  Repeat2,
  Link2,
} from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { QuoteNudgeMockup } from "@/components/labs/mockups/QuoteNudgeMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#B45309";

export function QuoteNudgeClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={HardHat}
        eyebrowText="For plumbers, electricians & contractors"
        ctaLabel="I Want This"
        headline={
          <>
            Your quote isn&apos;t lost. It&apos;s sitting in a text thread, <span style={{ color: ACCENT }}>unanswered</span>.
          </>
        }
        subheadline={
          <>
            QuoteNudge builds a branded quote from your phone in 2 minutes, tells you the moment your client
            <strong style={{ color: "#1A1A2E" }}> opens it</strong>, and keeps following up on unanswered quotes and unpaid invoices — automatically.
          </>
        }
        trustBullets={[
          { icon: Smartphone, text: "2-minute quote builder" },
          { icon: MessagesSquare, text: "WhatsApp-first" },
          { icon: BadgeDollarSign, text: "From $25/mo" },
        ]}
        mockup={<QuoteNudgeMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From standing in the driveway to a signed quote in three steps"
        intro="No laptop, no software to learn on-site. Build the quote on your phone, send it where your client will actually see it, and let the follow-up happen without you thinking about it."
        steps={[
          { num: "01", icon: Pencil, title: "Build the quote on-site", body: "Enter labor hours and material costs right from your phone. QuoteNudge turns it into a clean, branded, line-item quote in about 2 minutes." },
          { num: "02", icon: Send, title: "Send it where they'll see it", body: "SMS or WhatsApp, not a PDF buried in email. You get notified the moment your client opens it — no more wondering if it even arrived." },
          { num: "03", icon: BellRing, title: "We keep following up", body: "Unanswered quote? Unpaid invoice? QuoteNudge sends the follow-up automatically, so a slow reply never turns into a job you forgot to chase." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="You quoted the job. Then you never heard back — and never followed up either."
        intro="Contractors lose real revenue not because they did bad work, but because quoting and invoice follow-up eat time nobody has, and get dropped the moment a new job shows up."
        pains={[
          { icon: Hourglass, title: "Half a day gone building estimates that never convert", body: "Every quote takes real time to put together — and a big share of them go quiet, with no clear signal of whether the client is still deciding or has moved on." },
          { icon: FileWarning, title: "A bid mixed up and sent to the wrong client", body: "Juggling quotes across texts, paper, and memory means mistakes happen — and a wrong-client bid is an embarrassing, sometimes costly, way to lose trust." },
          { icon: BanknoteX, title: "Invoices that sit unpaid because no one's chasing them", body: "You're not going to call a client to ask for money you're owed every week — so unpaid invoices quietly age past 30, 60, 90 days." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One job, done properly: quotes that get seen, and invoices that get paid"
        intro="QuoteNudge isn't a full job-management platform. It's a focused tool for the two moments that cost contractors the most money: the quote going quiet, and the invoice going unpaid."
        features={[
          { icon: Smartphone, title: "Build a quote from your phone", body: "Labor hours and material costs in, a professional branded quote out — in about 2 minutes, without a laptop or office software." },
          { icon: Eye, title: "\"Quote viewed\" notifications", body: "Know the instant your client opens the quote, instead of guessing whether it's been seen, ignored, or lost in a thread." },
          { icon: Repeat2, title: "Automatic follow-up sequences", body: "Unanswered quotes and unpaid invoices get a scheduled, polite nudge — automatically, without you remembering to send it." },
          { icon: ListChecks, title: "Transparent line-item breakdowns", body: "Labor and materials shown clearly, addressing the #1 complaint customers have about vague, one-line contractor quotes." },
          { icon: MessagesSquare, title: "WhatsApp-first for the Indian market", body: "Built with WhatsApp as a first-class channel — the way plumbers, electricians, and interior contractors already communicate with clients." },
          { icon: Link2, title: "One-tap payment on the invoice", body: "A payment link sits right on the follow-up message, so accepting the quote and paying the invoice is never a separate, harder step." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="QuoteNudge"
        headline="QuoteNudge vs. heavyweight field-service software"
        intro="Jobber and ServiceTitan are built for large operations with dispatch, scheduling, and fleet management — most solo contractors and small crews just need a quote that gets answered and an invoice that gets paid."
        competitorLabel="Jobber / ServiceTitan"
        rows={[
          { feature: "Setup time", us: "Minutes, phone-only", them: "Hours to days, built for office staff" },
          { feature: "Price", us: "$25–$50/mo flat", them: "$100–$300+/mo, often per-user" },
          { feature: "Core focus", us: "Quote follow-up & invoice chasing", them: "Full dispatch, scheduling, fleet management" },
          { feature: "Client channel", us: "SMS & WhatsApp-first", them: "Email-first client portals" },
        ]}
        note="The real competitor for most solo contractors is a paper quote pad and a memory for who still owes what — free, but the reason so many quotes and invoices quietly go stale."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free for your first 3 quotes, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Try it on your next 3 quotes", features: ["3 quotes/mo", "SMS & WhatsApp sending", "Viewed notifications"] },
          { name: "Pro", price: "$25", period: "/mo", tagline: "For active solo contractors", features: ["Unlimited quotes & invoices", "Auto follow-up sequences", "Payment links"], highlight: true, badge: "Early-bird $19/mo forever" },
          { name: "Crew", price: "$50", period: "/mo", tagline: "For small teams", features: ["Everything in Pro", "Multiple team members", "Shared client history"] },
        ]}
        footnote="No per-quote fees. No 'contact sales' for a small crew upgrade."
      />

      <FeedbackForm
        toolSlug="quotenudge"
        toolName="QuoteNudge"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want QuoteNudge to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when QuoteNudge exists."
        step1Field={{
          kind: "pills",
          key: "trade",
          label: "What's your trade?",
          options: [
            { value: "plumbing", label: "Plumbing" },
            { value: "electrical", label: "Electrical" },
            { value: "general-contracting", label: "General contracting" },
            { value: "other-trade", label: "Other trade" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you send quotes and chase unpaid invoices today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "quoteVolume", label: "How many quotes do you send in a typical month?", options: [{ value: "under-10", label: "Under 10" }, { value: "10-30", label: "10–30" }, { value: "30-plus", label: "30+" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/quotenudge"
          items={[
            { q: "Is QuoteNudge live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough contractors want this, we'll build it next and email everyone who signed up first." },
            { q: "Do I need a laptop or office software?", a: "No. QuoteNudge is built phone-first — building and sending a quote from a job site, with no laptop, is the core use case." },
            { q: "Does it work over WhatsApp?", a: "Yes — WhatsApp is a first-class sending channel from day one, alongside SMS, since that's how many contractors already message clients directly." },
            { q: "How does the 'quote viewed' notification work?", a: "When your client opens the link to their quote, you get a notification — so you know whether it's been seen before you decide whether to follow up." },
            { q: "What happens if a client never responds?", a: "QuoteNudge sends a scheduled, polite automatic follow-up so the quote doesn't just go stale — you can always see its status and choose to reach out yourself too." },
            { q: "Can clients pay the invoice directly?", a: "Yes — a payment link is included with invoices and follow-ups so paying is a single tap, not a separate step your client has to figure out." },
            { q: "How is this different from Jobber or ServiceTitan?", a: "Those are full field-service platforms built for dispatch, scheduling, and fleet management at larger operations. QuoteNudge is scoped to one job — getting quotes answered and invoices paid — for solo contractors and small crews." },
            { q: "Can I send a quote to the wrong client by mistake?", a: "Every quote includes a clear client-name confirmation step before sending, specifically to prevent the kind of mix-up that happens when quotes are juggled across texts and paper." },
            { q: "What line items can I include in a quote?", a: "Labor hours and material costs are the core building blocks, shown as a transparent line-item breakdown — addressing the top complaint customers have about vague, single-line contractor quotes." },
            { q: "How much will QuoteNudge cost?", a: "Planned pricing starts at a free tier for your first 3 quotes, with paid plans from $25/month for unlimited quotes and automatic follow-up. Early waitlist signups lock in $19/month forever." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Can more than one person on my crew send quotes?", a: "The Crew plan is built around multiple team members sharing the same client history and quote/invoice status, so nothing gets lost between whoever's on-site and whoever's in the office." },
          ]}
        />
      </div>
    </>
  );
}
