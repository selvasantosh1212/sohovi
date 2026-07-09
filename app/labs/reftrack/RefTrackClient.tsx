import { Handshake, Percent, Link2, BadgeDollarSign, Key, Settings2, Banknote, DollarSign, Layers, Calculator, UserCheck, Undo2, FileDown } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { RefTrackMockup } from "@/components/labs/mockups/RefTrackMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#15803D";

export function RefTrackClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Handshake}
        eyebrowText="For bootstrapped SaaS founders"
        ctaLabel="Let's Build RefTrack"
        headline={
          <>
            Rewardful can cost <span style={{ color: ACCENT }}>more than your MRR</span>.
          </>
        }
        subheadline={
          <>
            RefTrack is flat-fee affiliate tracking for the founder with 5-20 affiliates who doesn&apos;t need PartnerStack-scale complexity —{" "}
            <strong style={{ color: "#1A1A2E" }}>just links, tracking, and commission math.</strong>
          </>
        }
        trustBullets={[
          { icon: Percent, text: "No revenue share" },
          { icon: Link2, text: "Stripe-native" },
          { icon: BadgeDollarSign, text: "$19/mo flat" },
        ]}
        mockup={<RefTrackMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From Stripe key to your first affiliate payout"
        intro="No enterprise integration. Connect Stripe, invite affiliates, pay them at month end."
        steps={[
          { num: "01", icon: Key, title: "Connect Stripe", body: "Paste a restricted API key or webhook — no complex integration, no engineering project." },
          { num: "02", icon: Settings2, title: "Set up your campaign", body: "Commission %, cookie window, recurring vs. first-payment-only. Different rates per campaign if you need them." },
          { num: "03", icon: Banknote, title: "Pay affiliates monthly", body: "Export a CSV formatted for PayPal Mass Pay. Refunds automatically claw back commission — no manual math." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Affiliate tools price for scale you don't have yet"
        intro="You want a handful of affiliates driving signups — not an enterprise partner program."
        pains={[
          { icon: DollarSign, title: "$49-59/mo before you've made a sale from it", body: "Rewardful and FirstPromoter's pricing barely notices whether you're a $500 MRR founder with 5 affiliates or a funded team with 50." },
          { icon: Layers, title: "PartnerStack and Impact are built for 100+ affiliates", body: "Enterprise affiliate platforms bring enterprise complexity — none of it useful when a handful of people are sharing your link." },
          { icon: Calculator, title: "Commission math by hand doesn't scale", body: "Tracking who referred what, handling refunds, and calculating payouts in a spreadsheet gets error-prone fast." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="What RefTrack actually does"
        intro="A flat-fee affiliate tool sized for 5-20 affiliates, not 500 — connected directly to the Stripe you already use."
        features={[
          { icon: Key, title: "Stripe-native setup", body: "Paste a restricted API key or webhook — connected in minutes, no custom integration work." },
          { icon: Settings2, title: "Flexible campaigns", body: "Commission %, cookie window, recurring vs. first-payment-only, all configurable per campaign." },
          { icon: Link2, title: "Attribution engine", body: "Tracking snippet matched to Stripe webhook events — accurate attribution without a heavy SDK." },
          { icon: UserCheck, title: "Affiliate mini-dashboard", body: "Magic-link access to their link, clicks, conversions, and earnings. No password to manage." },
          { icon: Undo2, title: "Automatic refund clawback", body: "Commissions adjust automatically the moment a customer refunds — no manual bookkeeping." },
          { icon: FileDown, title: "CSV payout export", body: "Formatted for PayPal Mass Pay every month — review, send, done." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="RefTrack"
        headline="RefTrack vs. Rewardful / FirstPromoter"
        intro="PartnerStack and Impact serve 100+ affiliate programs — a different, much larger problem than most micro-SaaS founders have."
        competitorLabel="Rewardful / FirstPromoter"
        rows={[
          { feature: "Price", us: "$19/mo flat", them: "$49–59/mo starting" },
          { feature: "Fees", us: "No % of revenue, no per-affiliate fee", them: "Some plans take a revenue cut" },
          { feature: "Built for", us: "5–20 affiliates", them: "Scaling programs, 50+" },
          { feature: "Setup", us: "Paste a Stripe key or webhook", them: "Similar integration, higher price tag" },
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        intro="No % of your revenue, no per-affiliate fees. Possibly free until your first affiliate-driven sale."
        plans={[
          { name: "Everyone", price: "$19", period: "/mo", tagline: "Flat, no revenue share, unlimited affiliates", features: ["Unlimited affiliates", "No revenue share", "CSV payout export"], highlight: true, badge: "One Plan" },
        ]}
      />

      <FeedbackForm
        toolSlug="reftrack"
        toolName="RefTrack"
        accent={ACCENT}
        ctaLabel="Let's Build RefTrack"
        waitlistHeadline="Want RefTrack to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when RefTrack exists."
        emailPlaceholder="you@startup.com"
        step1Field={{
          kind: "pills",
          key: "affiliates",
          label: "How many affiliates do you have or want?",
          options: [{ value: "0", label: "None yet" }, { value: "1-5", label: "1–5" }, { value: "5-20", label: "5–20" }, { value: "20+", label: "20+" }],
        }}
        step2Fields={[
          { kind: "text", key: "currentTool", label: "What do you use today, if anything?" },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/reftrack"
          items={[
            { q: "Is RefTrack live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough founders want this, we'll build it next and email everyone who signed up." },
            { q: "Do you take a cut of my revenue?", a: "No. RefTrack is a flat $19/mo regardless of how much your affiliates drive — unlike platforms that add a percentage on top of a base fee." },
            { q: "How does tracking work without cookies causing problems?", a: "A first-party cookie plus localStorage, with the referral code passed server-side into Stripe checkout metadata — robust for most cases, though Safari's tracking prevention has known limitations we'll document honestly rather than oversell." },
            { q: "Can affiliates see their own stats?", a: "Yes — a magic-link mini-dashboard shows each affiliate their link, clicks, conversions, and earnings. No password to manage." },
            { q: "What happens if a referred customer gets a refund?", a: "The commission is automatically clawed back when RefTrack sees the matching Stripe refund event." },
            { q: "How do affiliates actually get paid?", a: "RefTrack calculates what's owed and exports a monthly CSV formatted for PayPal Mass Pay — you review and send the payout yourself. RefTrack never touches your money or your affiliates' payment details directly." },
            { q: "Can different affiliates have different commission rates?", a: "Per-campaign commission rates are the initial design, so you can run different campaigns (e.g. a higher rate for a launch partner) rather than one flat rate for everyone." },
            { q: "Is there a contract or can I cancel anytime?", a: "Month-to-month, cancel anytime — no annual lock-in planned. It's meant to be as low-commitment as the price suggests." },
            { q: "Does RefTrack work with Paddle or Lemon Squeezy, not just Stripe?", a: "Stripe is the initial integration since it's the most common billing setup for early-stage SaaS. Paddle and Lemon Squeezy support would depend on demand — tell us in the form above if that's what you use." },
          ]}
        />
      </div>
    </>
  );
}
