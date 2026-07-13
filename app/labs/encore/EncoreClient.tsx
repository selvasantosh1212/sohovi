import { Music, CalendarCheck, Users, BadgeDollarSign, CalendarClock, Receipt, CalendarX, CircleDollarSign, CheckCheck, Send, Link as LinkIcon } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { EncoreMockup } from "@/components/labs/mockups/EncoreMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#6D5BA8";

export function EncoreClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Music}
        eyebrowText="For private & studio music teachers"
        ctaLabel="Let's Build Encore"
        headline={
          <>
            Your students, schedule, and billing live in <span style={{ color: ACCENT }}>three different apps</span>.
          </>
        }
        subheadline={
          <>
            Encore brings recurring lessons, attendance, practice assignments, and parent billing into <strong style={{ color: "#1A1A2E" }}>one place</strong> —
            built for how music teachers actually teach, not generic business scheduling.
          </>
        }
        trustBullets={[
          { icon: CalendarCheck, text: "Makeups tracked automatically" },
          { icon: Users, text: "Parent portal, no passwords" },
          { icon: BadgeDollarSign, text: "From $19/mo" },
        ]}
        mockup={<EncoreMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From spreadsheet chaos to a running studio in an afternoon"
        intro="No new habits to learn. Encore mirrors how lessons already work — weekly slots, makeups, monthly billing."
        steps={[
          { num: "01", icon: Users, title: "Add your roster", body: "Import your students from a CSV or add them by hand — instrument, level, rate, parent contact, and notes all live on one profile." },
          { num: "02", icon: CalendarClock, title: "Set recurring lessons", body: "Weekly slots with drag-to-reschedule. Attendance and makeup credits are tracked automatically — no more mental bookkeeping." },
          { num: "03", icon: Receipt, title: "Bill from lessons taught", body: "Monthly invoices generate themselves from actual lessons. Stripe for online payment, or mark-paid for cash — parents see it all via magic link." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Generic scheduling tools don't understand lessons"
        intro="Calendly plus a spreadsheet plus a payment app can just barely work — until you have 20 students and need to track makeups."
        pains={[
          { icon: CalendarX, title: "Makeup lessons fall through the cracks", body: "Recurring weekly slots, cancellations, and makeup credits need real tracking. A shared calendar just shows an event — not who owes a makeup and who doesn't." },
          { icon: Users, title: "Per-student progress lives in your head", body: "Instrument, level, notes, and practice assignments for each student rarely live anywhere a parent can actually see them." },
          { icon: CircleDollarSign, title: "Billing means chasing parents manually", body: "Without lesson-based invoicing, billing means remembering who paid, who didn't, and sending awkward reminder texts every month." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="Everything a lesson studio needs — nothing else"
        intro="Encore isn't another all-purpose booking tool. It's built around the weekly rhythm of teaching: lessons, makeups, practice, billing."
        features={[
          { icon: Users, title: "Student roster", body: "Instrument, level, parent contact, notes, and rate — one profile per student, everything in one place." },
          { icon: CalendarClock, title: "Recurring scheduling", body: "Weekly lesson slots with drag-to-reschedule. Built for the rhythm of teaching, not one-off bookings." },
          { icon: CheckCheck, title: "Attendance & makeup credits", body: "Cancellations become makeup credits automatically. Always know exactly who's owed what." },
          { icon: Send, title: "Practice assignments", body: "Auto-emailed to students and parents after each lesson — the follow-through that usually gets skipped." },
          { icon: Receipt, title: "Invoicing from lessons taught", body: "Monthly invoices generated from the actual schedule. Stripe, or mark-paid-manually for cash and transfers." },
          { icon: LinkIcon, title: "Parent portal via magic link", body: "Read-only view of lessons, assignments, and invoices. No passwords, no app to download." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="Encore"
        headline="Encore vs. what teachers use today"
        intro="The honest alternatives are MyMusicStaff — the dated incumbent — or duct-taping Calendly to a spreadsheet. Here's the difference."
        competitorLabel="MyMusicStaff / Calendly + spreadsheet"
        rows={[
          { feature: "Built for music lessons", us: "Instrument, level & makeups built in", them: "MyMusicStaff: yes, dated UX. Calendly: no, it's generic" },
          { feature: "Parent visibility", us: "Read-only portal via magic link", them: "Email chains, or nothing at all" },
          { feature: "Practice assignments", us: "Auto-emailed after every lesson", them: "Manual text or email, if it happens" },
          { feature: "Setup & feel", us: "Minutes, modern interface", them: "MyMusicStaff feels like it hasn't changed since 2010" },
        ]}
        note="MyMusicStaff is the established incumbent — functional, but the UX hasn't kept up. That gap is the opening."
      />

      <PricingPreview
        accent={ACCENT}
        intro="2 months free on annual billing. Not final: tell us below if this works for your studio."
        footnote="The first 10 teachers who sign up below get lifetime free access in exchange for feedback while we build."
        plans={[
          { name: "Solo Teacher", price: "$19", period: "/mo", tagline: "For up to 30 students", features: ["Up to 30 students", "Recurring scheduling", "Parent portal"] },
          { name: "Studio", price: "$29", period: "/mo", tagline: "For growing studios", features: ["Unlimited students", "Recurring scheduling", "Parent portal"], highlight: true, badge: "Most Popular" },
        ]}
      />

      <FeedbackForm
        toolSlug="encore"
        toolName="Encore"
        accent={ACCENT}
        ctaLabel="Let's Build Encore"
        waitlistHeadline="Want Encore to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when Encore exists."
        emailPlaceholder="you@studio.com"
        step1Field={{ kind: "text", key: "name", label: "Name", placeholder: "Jane Doe" }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you handle this today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "studentCount", label: "How many students do you currently teach?", options: [{ value: "<15", label: "Fewer than 15" }, { value: "15-30", label: "15–30" }, { value: "30+", label: "30+" }] },
          { kind: "text", key: "currentTool", label: "What do you use today to manage lessons and billing?" },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/encore"
          items={[
            { q: "Is Encore live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough teachers want this, we'll build it next and email everyone who signed up." },
            { q: "How is this different from MyMusicStaff?", a: "Same core idea — lessons, students, and billing in one place — but rebuilt with a modern interface and a parent portal that doesn't require a password or app download." },
            { q: "Will it handle group lessons?", a: "The first version focuses on 1-on-1 recurring lessons, the most common setup for private and studio teachers. Group lessons are a likely fast-follow if there's demand." },
            { q: "Do parents need to create an account?", a: "No. Parents get a magic link by email that opens a read-only view of upcoming lessons, assignments, and invoices — no password required." },
            { q: "Can I take payments through Encore?", a: "Yes, planned via Stripe invoicing for teachers who want online payment, with a simple 'mark as paid' option for teachers who collect cash or bank transfer." },
            { q: "Can I import my existing student list?", a: "Yes — a CSV import for your current roster is planned so switching from a spreadsheet, Calendly, or MyMusicStaff doesn't mean re-entering every student by hand." },
            { q: "Does Encore work for any instrument, or just piano?", a: "Any instrument — piano, guitar, voice, violin, drums, and so on. Instrument is just a field on each student's profile, not a separate product." },
            { q: "Is there a mobile app?", a: "The first version is a mobile-friendly web app that works well on a phone browser for both teachers and parents. A dedicated app is a possible fast-follow if there's demand." },
            { q: "How much does Encore cost?", a: "Planned pricing is $19/month for a solo teacher with up to 30 students, or $29/month for unlimited students — with 2 months free on annual billing. The first 10 teachers who sign up get lifetime free access." },
            { q: "What happens to my existing Stripe payment links if I switch to Encore?", a: "Encore's own Stripe invoicing is separate from whatever you use today — you can move students over gradually and keep collecting from existing payment links until every parent is migrated, rather than a hard cutover." },
            { q: "Can I set different rates per student or per lesson length?", a: "Yes — rate lives on each student's profile, so a 30-minute beginner and a 60-minute advanced student can be billed differently without any workaround." },
            { q: "How is a no-show different from a teacher-cancelled lesson for makeup credit?", a: "A student no-show doesn't generate a makeup credit by default (your policy, your call), while a teacher-initiated cancellation automatically does — the distinction that a generic shared calendar can't track." },
            { q: "Can a studio with several teachers share one account?", a: "The Studio plan removes the per-student cap for growing operations. Multiple teacher logins under one studio account is a likely next step if there's demand — tell us in the form above if that's how your studio is set up." },
          ]}
        />
      </div>
    </>
  );
}
