import { Mail, Building2, ImageOff } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "var(--sky)";

export function SignSyncClient() {
  return (
    <>
      <LabsHero
        eyebrow="For teams of 20–200 people"
        accent={ACCENT}
        ctaLabel="Let's build SignSync"
        headline={
          <>
            Enterprise signature tools want <span style={{ color: "#1B63E6" }}>100 seats minimum</span>. You have 40.
          </>
        }
        subheadline="SignSync deploys brand-consistent email signatures to every Gmail user on your team in one click — priced per seat, with no enterprise minimum."
      />

      <PainPointSection
        headline="The SMB signature gap nobody serves"
        intro="Companies with 20-200 employees need consistent signatures but don't fit enterprise tools built for 1,000-person orgs."
        pains={[
          {
            icon: Building2,
            title: "Exclaimer's pricing assumes you're huge",
            body: "$2/user/month sounds fine until you hit the roughly 100-seat minimum — a wall for exactly the companies that need this most.",
          },
          {
            icon: ImageOff,
            title: "Rebrands never fully roll out",
            body: "Someone updates the logo or tagline, and half the company is still sending emails with the old signature six months later.",
          },
          {
            icon: Mail,
            title: "Today it's an HTML file and a hope",
            body: "Without a deploy mechanism, 'updating the signature' means emailing a file to 40 people and hoping everyone follows the instructions.",
          },
        ]}
      />

      <ComparisonSection
        toolName="SignSync"
        competitorLabel="Exclaimer"
        accent="#1B63E6"
        rows={[
          { feature: "Price", us: "$1/user/month", them: "$2/user/month" },
          { feature: "Minimum seats", us: "None — $19/mo minimum spend", them: "~100 seats" },
          { feature: "Deploy to Gmail", us: "One click via Google Workspace Admin", them: "Yes, but built for IT-managed rollouts" },
          { feature: "Campaign banners", us: "Swap across all signatures at once", them: "Yes, enterprise tier only" },
        ]}
        note="WiseStamp is also enterprise-tilted. The 20-200 employee company is underserved by both."
      />

      <SolutionSection
        headline="What SignSync actually does"
        intro="Set a template once, deploy everywhere, keep it current without chasing anyone."
        accent="#1B63E6"
        bullets={[
          "Team import via CSV or Google Workspace directory sync",
          "Drag-block signature editor — 8-10 prebuilt templates, live preview with real employee data",
          "Per-employee variables: name, title, phone, department",
          "Department overrides — sales gets a booking link, support gets a help-center link",
          "One-click deploy to Gmail via Google Workspace Admin — the magic moment",
          "Campaign banners: swap a promo across every signature at once",
        ]}
      />

      <PricingPreview
        accent="#1B63E6"
        note="$1/user/month, $19/mo minimum. That undercuts Exclaimer's $2/user with no seat minimum — tell us if that pricing makes sense for your team."
        plans={[
          { name: "Any team size", price: "$1", period: "/user/mo", features: ["$19/mo minimum", "One-click Gmail deploy", "Campaign banners"], highlight: true },
        ]}
      />

      <FeedbackForm
        toolSlug="signsync"
        toolName="SignSync"
        accent="#1B63E6"
        ctaLabel="Let's build SignSync"
        questions={[
          {
            key: "team_size",
            label: "How many people would need signatures?",
            type: "select",
            required: true,
            options: [
              { value: "<20", label: "Under 20" },
              { value: "20-50", label: "20–50" },
              { value: "50-100", label: "50–100" },
              { value: "100-200", label: "100–200" },
              { value: "200+", label: "200+" },
            ],
          },
          {
            key: "email_platform",
            label: "Google Workspace or Microsoft 365?",
            type: "select",
            options: [
              { value: "workspace", label: "Google Workspace" },
              { value: "365", label: "Microsoft 365" },
              { value: "both", label: "Both" },
              { value: "neither", label: "Neither" },
            ],
          },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/signsync"
          items={[
            {
              q: "Is SignSync live yet?",
              a: "Not yet — this page exists to gauge interest before we build it. If enough teams want this, we'll build it next and email everyone who signed up.",
            },
            {
              q: "How is this cheaper than Exclaimer?",
              a: "Exclaimer is built for large enterprise rollouts and prices accordingly, with a seat minimum around 100. SignSync targets 20-200 person teams specifically, at $1/user/month with no minimum beyond $19/mo.",
            },
            {
              q: "Does it work with Microsoft 365 / Outlook?",
              a: "The one-click auto-deploy is Gmail-first via the Google Workspace Admin API. Outlook/365 teams get a self-serve 'copy my signature' link as a fallback in the first version — full Microsoft Graph auto-deploy is a likely next step.",
            },
            {
              q: "Can different departments have different signatures?",
              a: "Yes — department overrides let sales show a booking link, support show a help-center link, and so on, all from the same base template.",
            },
            {
              q: "Will you have access to our email content?",
              a: "No. SignSync only manages the signature block via Google's official Admin/Gmail APIs — it never reads, sends, or stores email content.",
            },
            {
              q: "Can I use our own logo and brand colors?",
              a: "Yes — the template editor is built around your logo, brand colors, and fonts from the start, with 8-10 prebuilt layouts to choose from rather than a blank canvas.",
            },
            {
              q: "How long does setup take?",
              a: "Minutes for the template itself. The one-time Google Workspace Admin connection (domain-wide delegation) is a guided, step-by-step wizard — designed to be the easiest part, not the blocker.",
            },
            {
              q: "What happens to everyone's signature if we cancel?",
              a: "Signatures already deployed to Gmail stay exactly as they are — cancelling just stops future template changes and campaign banner updates from pushing out.",
            },
            {
              q: "How much does a team email signature tool like this cost?",
              a: "Planned at $1/user/month with a $19/month minimum — meaningfully less than Exclaimer's $2/user/month, and with no roughly-100-seat minimum that locks out smaller teams.",
            },
          ]}
        />
      </div>
    </>
  );
}
