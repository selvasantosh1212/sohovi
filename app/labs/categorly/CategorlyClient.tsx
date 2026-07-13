import {
  Landmark,
  Smartphone,
  BadgeDollarSign,
  Link2,
  MailX,
  FileSpreadsheet,
  CalendarClock,
  BellRing,
  LayoutDashboard,
  Repeat,
  Download,
} from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { CategorlyMockup } from "@/components/labs/mockups/CategorlyMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#4338CA";

export function CategorlyClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Landmark}
        eyebrowText="For bookkeepers with 3+ clients"
        ctaLabel="I Want This"
        headline={
          <>
            Month-end close isn&apos;t waiting on the numbers. It&apos;s waiting on your <span style={{ color: ACCENT }}>clients</span>.
          </>
        }
        subheadline={
          <>
            Categorly syncs uncategorized transactions from QuickBooks or Xero and sends your client a <strong style={{ color: "#1A1A2E" }}>mobile swipe interface</strong> —
            &quot;What was this $45 charge?&quot; — with automatic reminders until every line item is done.
          </>
        }
        trustBullets={[
          { icon: Link2, text: "Syncs QuickBooks & Xero" },
          { icon: Smartphone, text: "No client login needed" },
          { icon: BadgeDollarSign, text: "From $30/mo" },
        ]}
        mockup={<CategorlyMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From uncategorized transactions to a closed month in three steps"
        intro="No more spreadsheet exports, no more email threads that go quiet for a week. Connect the books, send one link, and let the reminders do the chasing."
        steps={[
          { num: "01", icon: Link2, title: "Connect QuickBooks or Xero", body: "Categorly pulls in every uncategorized transaction automatically — no manual export, no copy-pasting into a spreadsheet." },
          { num: "02", icon: Smartphone, title: "Client gets a swipe link", body: "One magic link, mobile-friendly: \"What was this $45 charge?\" Your client swipes through in minutes, from their phone, no account needed." },
          { num: "03", icon: BellRing, title: "We handle the follow-up", body: "Automated reminders go out until everything's categorized. Your dashboard shows exactly who's done and who's still outstanding." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="The last two weeks of every month, you're not doing bookkeeping. You're chasing it."
        intro="Ask any bookkeeper with more than a handful of clients: the books aren't the bottleneck. Getting clients to tell you what an unlabeled charge actually was is. It's a structural problem for the entire profession, not a one-off client issue."
        pains={[
          { icon: MailX, title: "Reminder emails that get ignored, again", body: "You send the same follow-up three, four, five times a month, per client — and half the time it still sits unread until you call them directly." },
          { icon: FileSpreadsheet, title: "Spreadsheets that go missing or come back wrong", body: "The one you sent gets lost, filled in incorrectly, or comes back as a screenshot of a screenshot — more cleanup work than if you'd just asked directly." },
          { icon: CalendarClock, title: "Close pushed to the 20th, every single month", body: "Client deliverables, tax prep, and your own sanity all get pushed back because one $45 charge from three weeks ago still says 'Uncategorized.'" },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One job, done properly: get every transaction categorized, without the chasing"
        intro="Categorly isn't a full practice-management suite. It's a focused tool for the one recurring task that delays every close: getting answers out of your client's head and into your books."
        features={[
          { icon: Link2, title: "Direct QuickBooks & Xero sync", body: "Uncategorized transactions flow in automatically — no exports, no manual entry, always up to date with the books you're already working in." },
          { icon: Smartphone, title: "Mobile swipe interface", body: "A dead-simple, big-button interface your client can finish from their phone in the checkout line — not a form they'll put off until next week." },
          { icon: BellRing, title: "Automated reminder sequences", body: "Reminders escalate on a schedule you set, and stop the moment the client finishes — no more manually tracking who still owes you answers." },
          { icon: LayoutDashboard, title: "Per-client completion dashboard", body: "See exactly which clients are done, in progress, or ignoring you — across your entire book, at a glance, instead of client-by-client guesswork." },
          { icon: Repeat, title: "Categorization memory", body: "Once a client tells you \"Staples = Office Supplies,\" Categorly remembers it and pre-fills the same vendor next month, cutting their workload over time." },
          { icon: Download, title: "Clean export back to your books", body: "Finished categorizations sync back into QuickBooks or Xero automatically — no re-keying what your client already answered." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="Categorly"
        headline="Categorly vs. chasing clients manually"
        intro="General practice-management tools like Karbon or Financial Cents manage your workflow and deadlines — but none of them solve the actual bottleneck: getting a client to answer 'what was this charge' quickly."
        competitorLabel="Email + spreadsheet + manual follow-up"
        rows={[
          { feature: "Client effort", us: "Swipe through on a phone, 2–3 minutes", them: "Open a spreadsheet, fill in cells, email it back" },
          { feature: "Follow-up", us: "Automatic, scheduled, stops when done", them: "You remember to send it, manually, again" },
          { feature: "Visibility", us: "Live per-client completion dashboard", them: "Scattered across your inbox and memory" },
          { feature: "Books sync", us: "Two-way with QuickBooks & Xero", them: "Manual re-entry after the client replies" },
        ]}
        note="Practice-management platforms are built to manage your whole workflow — Categorly is built for one job: getting the client's answer, fast, without you nagging."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Free to try on one client, no credit card. Not final: tell us below if this pricing works for you."
        plans={[
          { name: "Free", price: "$0", period: "/mo", tagline: "Try it on one client", features: ["1 connected client", "QuickBooks or Xero sync", "Swipe interface"] },
          { name: "Solo", price: "$30", period: "/mo", tagline: "For independent bookkeepers", features: ["Up to 10 clients", "Automated reminders", "Completion dashboard"], highlight: true, badge: "Early-bird $22/mo forever" },
          { name: "Firm", price: "$80", period: "/mo", tagline: "For bookkeeping firms & teams", features: ["Unlimited clients", "Team seats", "Categorization memory"] },
        ]}
        footnote="No per-transaction fees. No 'contact sales' for a simple client count upgrade."
      />

      <FeedbackForm
        toolSlug="categorly"
        toolName="Categorly"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want Categorly to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when Categorly exists."
        step1Field={{
          kind: "pills",
          key: "role",
          label: "What best describes you?",
          options: [
            { value: "solo-bookkeeper", label: "Solo bookkeeper" },
            { value: "firm-owner", label: "Bookkeeping firm owner" },
            { value: "in-house-accountant", label: "In-house accountant" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you get clients to categorize transactions today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "clientCount", label: "How many active clients do you manage?", options: [{ value: "1-3", label: "1–3" }, { value: "4-10", label: "4–10" }, { value: "11-25", label: "11–25" }, { value: "25-plus", label: "25+" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/categorly"
          items={[
            { q: "Is Categorly live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough bookkeepers want this, we'll build it next and email everyone who signed up first." },
            { q: "Does my client need to create an account?", a: "No. Clients open a single magic link on their phone and start swiping through transactions — no login, no password, no app to download." },
            { q: "Which accounting platforms will it support?", a: "QuickBooks Online and Xero are the primary integrations planned for launch, since together they cover the large majority of small-business bookkeeping clients." },
            { q: "Does it replace my practice-management tool?", a: "No — Categorly is scoped to one job: getting uncategorized transactions answered by the client. It's meant to sit alongside tools like Karbon or Financial Cents, not replace them." },
            { q: "What if my client still ignores the reminders?", a: "You'll always see exactly what's outstanding on your dashboard, and can escalate manually — a phone call, a different contact — while Categorly keeps the automated nudges running in the background." },
            { q: "Can I customize the categories my client chooses from?", a: "Yes — the category list is meant to mirror your chart of accounts for that client, not a generic default list." },
            { q: "How does the categorization memory work?", a: "Once a client answers what a specific vendor or recurring charge is, Categorly remembers it and pre-fills the same answer for future transactions from that vendor, so the list they see each month gets shorter over time." },
            { q: "Is client financial data secure?", a: "Categorly only reads transaction metadata (amount, vendor, date) needed for categorization — it doesn't require full banking credentials, and connects through QuickBooks' and Xero's own authorized integration flows." },
            { q: "How much will Categorly cost?", a: "Planned pricing starts at a free tier for one client, with paid plans from $30/month for up to 10 clients. Early waitlist signups lock in $22/month forever. Firm-level unlimited-client pricing is planned at $80/month." },
            { q: "When does it launch?", a: "We're building it now. Joining the waitlist gets you first access and founder pricing when it ships." },
            { q: "Can multiple team members at my firm use it?", a: "The Firm plan is built around team seats so more than one bookkeeper can manage clients and see the same completion dashboard." },
            { q: "What happens to categorizations once they're confirmed?", a: "Confirmed categorizations sync back into QuickBooks or Xero automatically, so you never have to manually re-key what your client already answered." },
          ]}
        />
      </div>
    </>
  );
}
