import {
  FolderKanban,
  Clock,
  Lock,
  BadgeDollarSign,
  LayoutTemplate,
  Send,
  BellRing,
  Inbox,
  MailWarning,
  CircleDollarSign,
  Smartphone,
  Link2,
  Gauge,
  Paintbrush,
} from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { KickoffboxMockup } from "@/components/labs/mockups/KickoffboxMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#D9480F";

export function KickoffboxClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={FolderKanban}
        eyebrowText="For freelance web designers & small studios"
        ctaLabel="I Want This"
        headline={
          <>
            Your website projects aren&apos;t late. Your clients&apos; <span style={{ color: ACCENT }}>content</span> is.
          </>
        }
        subheadline={
          <>
            KickoffBox gets logos, copy, images, and logins out of your clients <strong style={{ color: "#1A1A2E" }}>without you sending a single reminder email</strong>.
            One link, one checklist — done.
          </>
        }
        trustBullets={[
          { icon: Clock, text: "60-second setup" },
          { icon: Lock, text: "No client login" },
          { icon: BadgeDollarSign, text: "Flat $12/mo" },
        ]}
        mockup={<KickoffboxMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From blank checklist to a finished client intake in three steps"
        intro="No forms to build from scratch, no client account to set up. Pick a template built for website projects, send it, and let the reminders do the chasing."
        steps={[
          { num: "01", icon: LayoutTemplate, title: "Pick a template", body: "\"Website Kickoff Pack\" gives you a ready-made client content checklist in 60 seconds — logo files, copy, images, logins, all pre-built." },
          { num: "02", icon: Send, title: "Send one link", body: "Your client opens it on any device — phone, tablet, laptop. No account, no password, no app to download." },
          { num: "03", icon: BellRing, title: "We do the nagging", body: "Polite automatic reminders go out until every item is checked off. You get one notification: \"Everything's in.\"" },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="You quoted 3 weeks. It's week 7. You're still waiting on the About page copy."
        intro="The design is ready. The dev is ready. The invoice isn't — because the homepage copy, the logo in vector format, and the hosting login are trapped somewhere in your client's inbox. Slow client content is the single most common cause of website project delays."
        pains={[
          { icon: Inbox, title: "Files scattered across email, WhatsApp, and \"I put it in Drive?\"", body: "Nothing lives in one place, so half your kickoff time goes to hunting down attachments instead of building the site." },
          { icon: MailWarning, title: "Sending reminder #4 and feeling like the bad guy", body: "Every follow-up email is another moment where you look unprofessional for chasing your own client for information you need to do the job." },
          { icon: CircleDollarSign, title: "The final invoice pushed back another month — again", body: "You can't launch, hand off, or bill the last milestone until the content shows up. The project stalls waiting on the client, not on you." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One job, done properly: everything a website project needs, out of your client's inbox"
        intro="KickoffBox isn't a bloated all-in-one suite. It's a focused tool that gets your client's content into your hands — and tells you exactly what's still missing."
        features={[
          { icon: LayoutTemplate, title: "Website-project templates", body: "Website Kickoff, Technical Handoff, SEO Basics, Redesign Brief, and Launch Checklist — built for web designers, ready to send." },
          { icon: Smartphone, title: "Mobile-first client checklist", body: "A simple, big-progress-bar checklist your client can actually finish from their phone. Zero learning curve." },
          { icon: BellRing, title: "One polite digest, not five", body: "Never more than one nudge per day, and it references exactly what's still missing. Reminders stop automatically the moment everything's in." },
          { icon: Link2, title: "Magic-link access", body: "No account, no password, no client login to forget. Your client opens the link and gets straight to the checklist." },
          { icon: Gauge, title: "Live progress you can see", body: "Know exactly what's checked off and what's outstanding, at a glance — no more \"just following up\" guesswork." },
          { icon: Paintbrush, title: "Your branding, not ours", body: "The checklist your client sees carries your studio's name, not a third-party tool's — it reads as part of your process." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="KickoffBox"
        headline="KickoffBox vs. other content collection tools"
        intro="Most content collection tools were built for accountants, law firms, and mortgage brokers, then priced accordingly. KickoffBox is built for one job: website kickoffs."
        competitorLabel="Other content collection tools"
        rows={[
          { feature: "Price", us: "Flat $12/mo, unlimited projects", them: "$35–$119/mo, priced per active request or per user" },
          { feature: "Who it's built for", us: "Web designers, out of the box", them: "Accountants, agencies-in-general — you build your own forms" },
          { feature: "Client experience", us: "One simple mobile checklist, no login", them: "Desktop-centric portals clients find confusing" },
          { feature: "Notifications", us: "One daily digest, auto-stops when done", them: "An email for every comment and field" },
        ]}
        note="The real competitor is Google Forms + a Drive folder + manual follow-up emails — free, but scattered, unprofessional, and easy to lose track of."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free for your first project, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Try it on one real project", features: ["1 active project", "All templates", "Mobile checklist"] },
          { name: "Pro", price: "$12", period: "/mo", tagline: "For every project after that", features: ["Unlimited projects & clients", "Your branding", "All templates"], highlight: true, badge: "Early-bird $9/mo forever" },
        ]}
        footnote="No per-user fees. No per-request fees. No 'contact sales.'"
      />

      <FeedbackForm
        toolSlug="kickoffbox"
        toolName="KickoffBox"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want KickoffBox to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when KickoffBox exists."
        step1Field={{
          kind: "pills",
          key: "role",
          label: "What best describes you?",
          options: [
            { value: "freelance-designer", label: "Freelance web designer" },
            { value: "small-agency", label: "Small agency / studio" },
            { value: "other-creative", label: "Other creative freelancer" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you collect content from clients today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "currentTool", label: "What do you use for this today?", options: [{ value: "forms-drive", label: "Google Forms + Drive" }, { value: "content-snare", label: "Content Snare" }, { value: "dubsado-honeybook", label: "Dubsado or HoneyBook" }, { value: "other", label: "Other" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/kickoffbox"
          items={[
            { q: "Is KickoffBox live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough web designers want this, we'll build it next and email everyone who signed up first." },
            { q: "Do my clients need to create an account?", a: "No. Clients open a single magic link and go straight to their checklist — no login, no password, no app to download." },
            { q: "Does it work on phones?", a: "Yes — the client-facing checklist is mobile-first, since most clients open their first link from their phone, not a desktop." },
            { q: "What if my client ignores it?", a: "KickoffBox sends escalating but polite reminders automatically, and you can always see exactly what's missing and forward the link manually yourself, too." },
            { q: "Is this only for web designers?", a: "It's optimized for website kickoff projects specifically — logo files, copy, images, hosting logins — but anyone collecting content from clients can use it." },
            { q: "How is this different from a generic content collection tool?", a: "Generic tools are built for accountants and law firms first, then adapted. KickoffBox ships with website-project templates out of the box, a mobile-first client checklist, and flat pricing with no per-request fees." },
            { q: "What's included in the Website Kickoff template?", a: "Logo and brand files, brand colors and fonts, page copy, an image library, and competitor links — the core assets almost every website project needs before design can start." },
            { q: "How much will KickoffBox cost?", a: "Planned pricing is a flat $12/month for unlimited projects and clients — no per-user or per-request fees. Early waitlist signups lock in $9/month forever. The free plan covers your first active project." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Can I customize a template beyond the built-in checklist items?", a: "Yes — the prebuilt templates are meant as a fast starting point, not a fixed list. Adding, removing, or renaming checklist items for your own process is planned from day one." },
            { q: "What file types and sizes can clients upload?", a: "Standard project assets — images, PDFs, common document and vector formats — with a per-file size limit generous enough for logo files and image libraries. Exact limits will be published once pricing finalizes." },
            { q: "Can I preview what the client will see before I send the link?", a: "Yes — seeing the exact checklist your client is about to receive, before it goes out, is part of the send flow so there are no surprises on their end." },
            { q: "Does it integrate with the project management tool I already use?", a: "Not directly in the first version — KickoffBox is focused on the content-collection step itself. A completed project's files and answers are exportable, and direct integrations with tools like Asana or Trello would depend on demand." },
          ]}
        />
      </div>
    </>
  );
}
