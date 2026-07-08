import { Calendar, Users, DollarSign } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

// A darker plum than the --lavender token — used as text/button-background
// throughout this page, so it needs to stay readable against white, not
// just decorative (the pastel token is reserved for small dots/badges).
const ACCENT = "#6D5BA8";

export function EncoreClient() {
  return (
    <>
      <LabsHero
        eyebrow="For private & studio music teachers"
        accent={ACCENT}
        ctaLabel="Let's build Encore"
        headline={
          <>
            Your students, schedule, and billing live in <span style={{ color: ACCENT }}>three different apps</span>.
          </>
        }
        subheadline="Encore brings recurring lessons, attendance, practice assignments, and parent billing into one place built for how music teachers actually teach — not generic business scheduling."
      />

      <PainPointSection
        headline="Generic scheduling tools don't understand lessons"
        intro="Calendly plus a spreadsheet plus a payment app can just barely work — until you have 20 students and need to track makeups."
        pains={[
          {
            icon: Calendar,
            title: "Makeup lessons fall through the cracks",
            body: "Recurring weekly slots, cancellations, and makeup credits need real tracking. A shared calendar just shows an event — not who owes a makeup and who doesn't.",
          },
          {
            icon: Users,
            title: "Per-student progress lives in your head",
            body: "Instrument, level, notes, and practice assignments for each student rarely live anywhere a parent can actually see them.",
          },
          {
            icon: DollarSign,
            title: "Billing means chasing parents manually",
            body: "Without lesson-based invoicing, billing means remembering who paid, who didn't, and sending awkward reminder texts every month.",
          },
        ]}
      />

      <ComparisonSection
        toolName="Encore"
        competitorLabel="MyMusicStaff / Calendly + spreadsheet"
        accent={ACCENT}
        rows={[
          { feature: "Built for music lessons", us: "Instrument, level & makeups built in", them: "MyMusicStaff: yes, dated UX. Calendly: no, it's generic" },
          { feature: "Parent visibility", us: "Read-only portal via magic link", them: "Email chains, or nothing at all" },
          { feature: "Practice assignments", us: "Auto-emailed after every lesson", them: "Manual text or email, if it happens" },
          { feature: "Setup & feel", us: "Minutes, modern interface", them: "MyMusicStaff feels like it hasn't changed since 2010" },
        ]}
        note="MyMusicStaff is the established incumbent — functional, but the UX hasn't kept up. That gap is the opening."
      />

      <SolutionSection
        headline="What Encore actually does"
        intro="Everything a private or studio teacher needs to run lessons — nothing else."
        accent={ACCENT}
        bullets={[
          "Student roster: instrument, level, parent contact, notes, rate",
          "Recurring weekly lesson scheduling with drag-to-reschedule",
          "Attendance and makeup-credit tracking, automatically",
          "Practice assignments auto-emailed to students/parents after each lesson",
          "Monthly invoicing generated from lessons taught — Stripe or mark-paid-manually",
          "Read-only parent portal via magic link — no password to manage",
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        note="Planned: 2 months free on annual billing, and the first 10 teachers who sign up below get lifetime free access in exchange for feedback while we build. Pricing isn't final — tell us if it works for your studio."
        plans={[
          { name: "Solo Teacher", price: "$19", period: "/mo", features: ["Up to 30 students", "Recurring scheduling", "Parent portal"] },
          { name: "Studio", price: "$29", period: "/mo", features: ["Unlimited students", "Recurring scheduling", "Parent portal"], highlight: true },
        ]}
      />

      <FeedbackForm
        toolSlug="encore"
        toolName="Encore"
        accent={ACCENT}
        ctaLabel="Let's build Encore"
        questions={[
          {
            key: "student_count",
            label: "How many students do you currently teach?",
            type: "select",
            required: true,
            options: [
              { value: "<15", label: "Fewer than 15" },
              { value: "15-30", label: "15–30" },
              { value: "30+", label: "30+" },
            ],
          },
          {
            key: "current_tool",
            label: "What do you use today to manage lessons and billing?",
            type: "text",
          },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/encore"
          items={[
            {
              q: "Is Encore live yet?",
              a: "Not yet — this page exists to gauge interest before we build it. If enough teachers want this, we'll build it next and email everyone who signed up.",
            },
            {
              q: "How is this different from MyMusicStaff?",
              a: "Same core idea — lessons, students, and billing in one place — but rebuilt with a modern interface and a parent portal that doesn't require a password or app download.",
            },
            {
              q: "Will it handle group lessons?",
              a: "The first version focuses on 1-on-1 recurring lessons, the most common setup for private and studio teachers. Group lessons are a likely fast-follow if there's demand.",
            },
            {
              q: "Do parents need to create an account?",
              a: "No. Parents get a magic link by email that opens a read-only view of upcoming lessons, assignments, and invoices — no password required.",
            },
            {
              q: "Can I take payments through Encore?",
              a: "Yes, planned via Stripe invoicing for teachers who want online payment, with a simple 'mark as paid' option for teachers who collect cash or bank transfer.",
            },
            {
              q: "Can I import my existing student list?",
              a: "Yes — a CSV import for your current roster is planned so switching from a spreadsheet, Calendly, or MyMusicStaff doesn't mean re-entering every student by hand.",
            },
            {
              q: "Does Encore work for any instrument, or just piano?",
              a: "Any instrument — piano, guitar, voice, violin, drums, and so on. Instrument is just a field on each student's profile, not a separate product.",
            },
            {
              q: "Is there a mobile app?",
              a: "The first version is a mobile-friendly web app that works well on a phone browser for both teachers and parents. A dedicated app is a possible fast-follow if there's demand.",
            },
            {
              q: "How much does Encore cost?",
              a: "Planned pricing is $19/month for a solo teacher with up to 30 students, or $29/month for unlimited students — with 2 months free on annual billing. The first 10 teachers who sign up get lifetime free access.",
            },
          ]}
        />
      </div>
    </>
  );
}
