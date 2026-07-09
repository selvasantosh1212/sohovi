import { Database, Timer, Lock, BadgeDollarSign, Plug, CalendarClock, RotateCcw, AlertTriangle, Terminal, CloudUpload, BellRing, Eraser } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { SnapbackMockup } from "@/components/labs/mockups/SnapbackMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#2D7FF9";

export function SnapbackClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={Database}
        eyebrowText="For teams on Supabase · Neon · Turso"
        ctaLabel="I Want This"
        headline={
          <>
            One bad migration shouldn&apos;t cost you <span style={{ color: ACCENT }}>everything</span>.
          </>
        }
        subheadline={
          <>
            SnapBack backs up your database on a schedule and streams every copy to a storage bucket <strong style={{ color: "#1A1A2E" }}>you own</strong>.
            When something breaks, restoring is a 2-minute job — not a 2-week nightmare.
          </>
        }
        trustBullets={[
          { icon: Timer, text: "~5 min setup" },
          { icon: Lock, text: "Your bucket, your data" },
          { icon: BadgeDollarSign, text: "From $9/mo flat" },
        ]}
        mockup={<SnapbackMockup />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="From connection string to your first backup in under 5 minutes"
        intro="No agents to install, no scripts to maintain. Three steps, and your data has a safety net."
        steps={[
          { num: "01", icon: Plug, title: "Connect", body: "Paste your database connection string. It's encrypted at rest and tested before it's saved — nothing else to install." },
          { num: "02", icon: CalendarClock, title: "Schedule", body: "Pick daily, every 12 hours, or weekly. Backups stream straight to your own S3, R2, or B2 bucket — never through our servers." },
          { num: "03", icon: RotateCcw, title: "Restore", body: "When something breaks, SnapBack generates the exact restore command for your backup. Copy, run, back in business." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Free-tier databases don't come with a safety net"
        intro="Thousands of people are shipping production apps on Supabase and Neon free tiers — most with zero backup strategy. It works fine, right up until the day it doesn't."
        pains={[
          { icon: AlertTriangle, title: "One bad migration, gone forever", body: "Supabase and Neon's free and starter tiers offer little to no automated backup retention. A dropped table or bad ALTER statement can mean permanent data loss." },
          { icon: Lock, title: "Real recovery is locked behind a tier jump", body: "Point-in-time recovery is usually gated behind an expensive plan upgrade — overkill if you just want peace of mind on a side project or early-stage startup." },
          { icon: Terminal, title: "DIY pg_dump scripts are a chore", body: "Writing and maintaining your own cron + pg_dump + cloud-upload script works — until the day you quietly stop checking whether it's still running." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One job, done properly: your data out safely, on a schedule"
        intro="SnapBack isn't a platform. It's a focused tool that gets your data into storage you control — and tells you the moment anything goes wrong."
        features={[
          { icon: Plug, title: "Connection-string setup", body: "Encrypted at rest, tested before it's saved. No agents, no SDKs, no infrastructure changes." },
          { icon: CloudUpload, title: "Streams to your bucket", body: "S3, Backblaze B2, or Cloudflare R2 — backups go directly to storage you own. We never hold your data." },
          { icon: CalendarClock, title: "Schedules that fit", body: "Daily, every 12 hours, or weekly. Set it once and stop thinking about it." },
          { icon: BellRing, title: "Alerts when it matters", body: "An email the moment a backup fails, plus a weekly 'all healthy' digest so silence never means uncertainty." },
          { icon: Eraser, title: "Automatic retention", body: "Keep the last N backups; older ones are pruned automatically. No manual cleanup, no surprise storage bills." },
          { icon: RotateCcw, title: "Restore instructions", body: "One click generates the exact restore command for your specific backup file. Copy, run, done." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="SnapBack"
        headline="SnapBack vs. the way you'd do it yourself"
        intro="The honest alternative is a DIY pg_dump script or paying your platform for point-in-time recovery. Here's the difference."
        competitorLabel="DIY scripts / platform PITR"
        rows={[
          { feature: "Setup time", us: "~5 minutes", them: "Hours writing & testing scripts" },
          { feature: "Where backups live", us: "Your own S3 / R2 / B2 bucket", them: "Vendor's servers, or wherever you configured" },
          { feature: "Cost for real retention", us: "$9/mo flat", them: "Tier upgrade, often $25+/mo" },
          { feature: "Failure alerts", us: "Emailed the moment a backup fails", them: "You find out when you actually need it" },
        ]}
        note="Snaplet, a similar independent tool, shut down in 2024 — this space still needs a simple, actively maintained option."
      />

      <PricingPreview
        accent={ACCENT}
        intro="Every plan would include a 14-day free trial — no credit card. Not final: tell us below if this works for you."
        plans={[
          { name: "Solo", price: "$9", period: "/mo", tagline: "For one side project that matters", features: ["1 database", "Daily backups", "Failure alerts"] },
          { name: "Pro", price: "$19", period: "/mo", tagline: "For your startup's production data", features: ["5 databases", "Every-12h schedule", "Priority support"], highlight: true, badge: "Most Popular" },
          { name: "Agency", price: "$39", period: "/mo", tagline: "For client work across projects", features: ["15 databases", "Every-12h schedule", "Priority support"] },
        ]}
      />

      <FeedbackForm
        toolSlug="snapback"
        toolName="SnapBack"
        accent={ACCENT}
        ctaLabel="I Want This"
        waitlistHeadline="Want SnapBack to exist?"
        waitlistIntro="Takes 10 seconds, no commitment. No product yet, no spam — one email when it ships, and your answers shape what we build."
        emailFootnote="Your email is used for exactly one thing: telling you when SnapBack exists."
        step1Field={{ kind: "text", key: "name", label: "Name", placeholder: "Jane Doe" }}
        step2Fields={[
          { kind: "pills", key: "wouldPay", label: "Would you pay for this if it worked exactly as described?", options: [{ value: "yes", label: "Yes, definitely" }, { value: "maybe", label: "Maybe, depends on price" }, { value: "no", label: "No" }] },
          { kind: "textarea", key: "howSolveToday", label: "How do you handle this today?" },
          { kind: "textarea", key: "mustHaveReason", label: "What would make this a must-have for you?" },
          { kind: "pills", key: "db", label: "Which database do you use?", options: [{ value: "supabase", label: "Supabase" }, { value: "neon", label: "Neon" }, { value: "turso", label: "Turso" }, { value: "postgres", label: "Postgres elsewhere" }, { value: "other", label: "Other" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/snapback"
          items={[
            { q: "Is SnapBack live yet?", a: "Not yet — this page exists to gauge interest before we build it. If enough people want this, we'll build it next and email everyone who signed up." },
            { q: "Where do backups actually get stored?", a: "In a storage bucket you own and control — AWS S3, Backblaze B2, or Cloudflare R2. SnapBack streams the backup directly there; it never sits on our servers." },
            { q: "Does this replace Supabase's or Neon's built-in backups?", a: "It complements them. Platform point-in-time recovery is great but is often locked behind a paid tier upgrade. SnapBack gives you an independent, portable copy of your data on a schedule you control, in storage you own." },
            { q: "Which databases will be supported?", a: "Postgres-compatible databases first — Supabase, Neon, and self-hosted Postgres — via pg_dump. Turso/SQLite support is planned using its own backup APIs." },
            { q: "Will you be able to see my data?", a: "No. Backups stream directly from your database to your storage bucket. Your connection string is encrypted at rest and used only to run the scheduled backup job." },
            { q: "How much will SnapBack cost?", a: "Planned pricing starts at $9/month for one database with daily backups, up to $39/month for agencies managing 15 databases. Every plan is meant to include a 14-day free trial with no credit card required — tell us in the questions above if that pricing works for you." },
            { q: "How do I restore a database from a SnapBack backup?", a: "SnapBack generates the exact restore command for your specific backup file — copy it, run it, done. Fully automated one-click restore (no command line) is planned as a fast-follow once the core backup engine ships." },
            { q: "How is this different from writing my own pg_dump backup script?", a: "A DIY pg_dump + cron + cloud-upload script works fine — until you forget to check whether it's still running. SnapBack is that same idea, hosted, scheduled, monitored, and alerting you the moment a backup actually fails." },
            { q: "Does SnapBack support MySQL or only Postgres?", a: "Postgres-compatible databases (Supabase, Neon, self-hosted Postgres) and Turso/SQLite are the initial scope. MySQL support would depend on demand — mention it in the form above if that's what you need." },
          ]}
        />
      </div>
    </>
  );
}
