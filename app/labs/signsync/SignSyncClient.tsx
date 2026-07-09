import { Building2, MousePointerClick, Users, BadgeDollarSign, Upload, LayoutTemplate, ImageOff, Mail, UserCog, GitBranch, Megaphone } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { SignSyncMockup } from "@/components/labs/mockups/SignSyncMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#1B63E6";

export function SignSyncClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Building2}
        eyebrowText="For teams of 20–200 people"
        ctaLabel="Let's Build SignSync"
        headline={
          <>
            Enterprise signature tools want <span style={{ color: ACCENT }}>100 seats minimum</span>. You have 40.
          </>
        }
        subheadline={
          <>
            SignSync deploys brand-consistent email signatures to every Gmail user on your team in <strong style={{ color: "#1A1A2E" }}>one click</strong> —
            priced per seat, with no enterprise minimum.
          </>
        }
        trustBullets={[
          { icon: MousePointerClick, text: "One-click Gmail deploy" },
          { icon: Users, text: "No seat minimum" },
          { icon: BadgeDollarSign, text: "$1/user/mo" },
        ]}
        mockup={<SignSyncMockup accent={ACCENT} />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="One template, deployed to every inbox in minutes"
        intro="No IT ticket, no emailing an HTML file around. Set it once, push it everywhere, keep it current."
        steps={[
          { num: "01", icon: Upload, title: "Import your team", body: "CSV or Google Workspace directory sync — names, titles, phone, and department flow straight into per-employee variables." },
          { num: "02", icon: LayoutTemplate, title: "Design the template", body: "Drag-block editor with 8-10 prebuilt layouts, live-previewed with real employee data. Department overrides for sales vs. support links." },
          { num: "03", icon: MousePointerClick, title: "Deploy in one click", body: "Push to every Gmail account via Google Workspace Admin. Swap a campaign banner across the whole company whenever you need to." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="The SMB signature gap nobody serves"
        intro="Companies with 20-200 employees need consistent signatures but don't fit enterprise tools built for 1,000-person orgs."
        pains={[
          { icon: Building2, title: "Exclaimer's pricing assumes you're huge", body: "$2/user/month sounds fine until you hit the roughly 100-seat minimum — a wall for exactly the companies that need this most." },
          { icon: ImageOff, title: "Rebrands never fully roll out", body: "Someone updates the logo or tagline, and half the company is still sending emails with the old signature six months later." },
          { icon: Mail, title: "Today it's an HTML file and a hope", body: "Without a deploy mechanism, 'updating the signature' means emailing a file to 40 people and hoping everyone follows the instructions." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="Set it once, deploy everywhere, stays current"
        intro="SignSync isn't an all-purpose email tool — it does one job: keep every signature in your company on-brand, without chasing anyone."
        features={[
          { icon: Upload, title: "Team import", body: "CSV or Google Workspace directory sync — no manual re-entry of a roster you already have." },
          { icon: LayoutTemplate, title: "Drag-block editor", body: "8-10 prebuilt templates with live preview using real employee data, not lorem ipsum." },
          { icon: UserCog, title: "Per-employee variables", body: "Name, title, phone, and department fill in automatically from the imported roster." },
          { icon: GitBranch, title: "Department overrides", body: "Sales gets a booking link, support gets a help-center link — all from one base template." },
          { icon: MousePointerClick, title: "One-click Gmail deploy", body: "Push to every account via Google Workspace Admin — the actual magic moment." },
          { icon: Megaphone, title: "Campaign banners", body: "Swap a promo banner across every signature in the company at once, then revert just as easily." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="SignSync"
        headline="SignSync vs. Exclaimer"
        intro="WiseStamp is also enterprise-tilted. The 20-200 employee company is underserved by both."
        competitorLabel="Exclaimer"
        rows={[
          { feature: "Price", us: "$1/user/month", them: "$2/user/month" },
          { feature: "Minimum seats", us: "None — $19/mo minimum spend", them: "~100 seats" },
          { feature: "Deploy to Gmail", us: "One click via Google Workspace Admin", them: "Yes, but built for IT-managed rollouts" },
          { feature: "Campaign banners", us: "Swap across all signatures at once", them: "Yes, enterprise tier only" },
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        intro="$1/user/month undercuts Exclaimer's $2/user with no seat minimum. Not final — tell us below if this works for you."
        plans={[
          { name: "Any team size", price: "$1", period: "/user/mo", tagline: "$19/mo minimum spend", features: ["No seat minimum", "One-click Gmail deploy", "Campaign banners"], highlight: true, badge: "One Plan" },
        ]}
      />

      <FeedbackForm
        toolSlug="signsync"
        toolName="SignSync"
        accent={ACCENT}
        ctaLabel="Let's Build SignSync"
        waitlistHeadline="Want SignSync to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when SignSync exists."
        step1Field={{
          kind: "pills",
          key: "teamSize",
          label: "Company size",
          options: [{ value: "<20", label: "Under 20" }, { value: "20-50", label: "20–50" }, { value: "50-100", label: "50–100" }, { value: "100-200", label: "100–200" }, { value: "200+", label: "200+" }],
        }}
        step2Fields={[
          { kind: "pills", key: "platform", label: "Google Workspace or Microsoft 365?", options: [{ value: "workspace", label: "Google Workspace" }, { value: "365", label: "Microsoft 365" }, { value: "both", label: "Both" }, { value: "neither", label: "Neither" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you handle signatures today?" },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/signsync"
          items={[
            { q: "Is SignSync live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough teams want this, we'll build it next and email everyone who signed up." },
            { q: "How is this cheaper than Exclaimer?", a: "Exclaimer is built for large enterprise rollouts and prices accordingly, with a seat minimum around 100. SignSync targets 20-200 person teams specifically, at $1/user/month with no minimum beyond $19/mo." },
            { q: "Does it work with Microsoft 365 / Outlook?", a: "The one-click auto-deploy is Gmail-first via the Google Workspace Admin API. Outlook/365 teams get a self-serve 'copy my signature' link as a fallback in the first version — full Microsoft Graph auto-deploy is a likely next step." },
            { q: "Can different departments have different signatures?", a: "Yes — department overrides let sales show a booking link, support show a help-center link, and so on, all from the same base template." },
            { q: "Will you have access to our email content?", a: "No. SignSync only manages the signature block via Google's official Admin/Gmail APIs — it never reads, sends, or stores email content." },
            { q: "Can I use our own logo and brand colors?", a: "Yes — the template editor is built around your logo, brand colors, and fonts from the start, with 8-10 prebuilt layouts to choose from rather than a blank canvas." },
            { q: "How long does setup take?", a: "Minutes for the template itself. The one-time Google Workspace Admin connection (domain-wide delegation) is a guided, step-by-step wizard — designed to be the easiest part, not the blocker." },
            { q: "What happens to everyone's signature if we cancel?", a: "Signatures already deployed to Gmail stay exactly as they are — cancelling just stops future template changes and campaign banner updates from pushing out." },
            { q: "How much does a team email signature tool like this cost?", a: "Planned at $1/user/month with a $19/month minimum — meaningfully less than Exclaimer's $2/user/month, and with no roughly-100-seat minimum that locks out smaller teams." },
          ]}
        />
      </div>
    </>
  );
}
