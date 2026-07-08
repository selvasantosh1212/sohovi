import { DollarSign, Layers, Calculator } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#15803D";

export function RefTrackClient() {
  return (
    <>
      <LabsHero
        eyebrow="For bootstrapped SaaS founders"
        accent={ACCENT}
        ctaLabel="Let's build RefTrack"
        headline={
          <>
            Rewardful can cost <span style={{ color: ACCENT }}>more than your MRR</span>.
          </>
        }
        subheadline="RefTrack is flat-fee affiliate tracking for the founder with 5-20 affiliates who doesn't need PartnerStack-scale complexity — just links, tracking, and commission math."
      />

      <PainPointSection
        headline="Affiliate tools price for scale you don't have yet"
        intro="You want a handful of affiliates driving signups — not an enterprise partner program."
        pains={[
          {
            icon: DollarSign,
            title: "$49-59/mo before you've made a sale from it",
            body: "Rewardful and FirstPromoter's pricing barely notices whether you're a $500 MRR founder with 5 affiliates or a funded team with 50.",
          },
          {
            icon: Layers,
            title: "PartnerStack and Impact are built for 100+ affiliates",
            body: "Enterprise affiliate platforms bring enterprise complexity — none of it useful when a handful of people are sharing your link.",
          },
          {
            icon: Calculator,
            title: "Commission math by hand doesn't scale",
            body: "Tracking who referred what, handling refunds, and calculating payouts in a spreadsheet gets error-prone fast.",
          },
        ]}
      />

      <ComparisonSection
        toolName="RefTrack"
        competitorLabel="Rewardful / FirstPromoter"
        accent={ACCENT}
        rows={[
          { feature: "Price", us: "$19/mo flat", them: "$49–59/mo starting" },
          { feature: "Fees", us: "No % of revenue, no per-affiliate fee", them: "Some plans take a revenue cut" },
          { feature: "Built for", us: "5–20 affiliates", them: "Scaling programs, 50+" },
          { feature: "Setup", us: "Paste a Stripe key or webhook", them: "Similar integration, higher price tag" },
        ]}
        note="PartnerStack and Impact serve 100+ affiliate programs — a different, much larger problem than most micro-SaaS founders have."
      />

      <SolutionSection
        headline="What RefTrack actually does"
        accent={ACCENT}
        bullets={[
          "Paste a restricted Stripe API key or webhook — no complex integration",
          "Campaign setup: commission %, cookie window, recurring vs. first-payment-only",
          "Affiliate mini-dashboard via magic link — their link, clicks, conversions, earnings",
          "Tracking snippet + attribution engine matched to Stripe webhook events",
          "Automatic refund clawback — commissions adjust when a customer refunds",
          "Monthly CSV payout export formatted for PayPal Mass Pay",
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        note="No % of your revenue. No per-affiliate fees. Flat. Possibly free until your first affiliate-driven sale, so you're not paying before it's proven itself. Tell us below if that pricing makes sense for you."
        plans={[{ name: "Everyone", price: "$19", period: "/mo", features: ["Unlimited affiliates", "No revenue share", "CSV payout export"], highlight: true }]}
      />

      <FeedbackForm
        toolSlug="reftrack"
        toolName="RefTrack"
        accent={ACCENT}
        ctaLabel="Let's build RefTrack"
        questions={[
          {
            key: "affiliate_count",
            label: "How many affiliates do you have or want?",
            type: "select",
            required: true,
            options: [
              { value: "0", label: "None yet, but want to start" },
              { value: "1-5", label: "1–5" },
              { value: "5-20", label: "5–20" },
              { value: "20+", label: "20+" },
            ],
          },
          { key: "current_tool", label: "What do you use today, if anything?", type: "text" },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/reftrack"
          items={[
            {
              q: "Is RefTrack live yet?",
              a: "Not yet — this page exists to gauge interest before we build it. If enough founders want this, we'll build it next and email everyone who signed up.",
            },
            {
              q: "Do you take a cut of my revenue?",
              a: "No. RefTrack is a flat $19/mo regardless of how much your affiliates drive — unlike platforms that add a percentage on top of a base fee.",
            },
            {
              q: "How does tracking work without cookies causing problems?",
              a: "A first-party cookie plus localStorage, with the referral code passed server-side into Stripe checkout metadata — robust for most cases, though Safari's tracking prevention has known limitations we'll document honestly rather than oversell.",
            },
            {
              q: "Can affiliates see their own stats?",
              a: "Yes — a magic-link mini-dashboard shows each affiliate their link, clicks, conversions, and earnings. No password to manage.",
            },
            {
              q: "What happens if a referred customer gets a refund?",
              a: "The commission is automatically clawed back when RefTrack sees the matching Stripe refund event.",
            },
            {
              q: "How do affiliates actually get paid?",
              a: "RefTrack calculates what's owed and exports a monthly CSV formatted for PayPal Mass Pay — you review and send the payout yourself. RefTrack never touches your money or your affiliates' payment details directly.",
            },
            {
              q: "Can different affiliates have different commission rates?",
              a: "Per-campaign commission rates are the initial design, so you can run different campaigns (e.g. a higher rate for a launch partner) rather than one flat rate for everyone.",
            },
            {
              q: "Is there a contract or can I cancel anytime?",
              a: "Month-to-month, cancel anytime — no annual lock-in planned. It's meant to be as low-commitment as the price suggests.",
            },
            {
              q: "Does RefTrack work with Paddle or Lemon Squeezy, not just Stripe?",
              a: "Stripe is the initial integration since it's the most common billing setup for early-stage SaaS. Paddle and Lemon Squeezy support would depend on demand — tell us in the form below if that's what you use.",
            },
          ]}
        />
      </div>
    </>
  );
}
