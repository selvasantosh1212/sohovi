import { AlertTriangle, Clock, Terminal } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "var(--terracotta)";

export function SnapbackClient() {
  return (
    <>
      <LabsHero
        eyebrow="For teams on Supabase, Neon & Turso"
        accent={ACCENT}
        ctaLabel="Let's build SnapBack"
        headline={
          <>
            Your database has <span style={{ color: ACCENT }}>no backup plan</span>.
            <br />
            One bad migration away from disaster.
          </>
        }
        subheadline="SnapBack automatically backs up your Supabase, Neon, or Turso database to storage you own — so a dropped table or bad migration is a 2-minute fix, not a 2-week nightmare."
      />

      <PainPointSection
        headline="Free-tier databases don't come with a safety net"
        intro="The 'vibe coding' wave means thousands of people are shipping production apps on Supabase and Neon free tiers — most with zero backup strategy."
        pains={[
          {
            icon: AlertTriangle,
            title: "One bad migration, gone forever",
            body: "Supabase and Neon's free and starter tiers offer little to no automated backup retention. A dropped table or bad ALTER statement can mean permanent data loss.",
          },
          {
            icon: Clock,
            title: "Real recovery is locked behind a tier jump",
            body: "Point-in-time recovery is usually gated behind an expensive plan upgrade — overkill if you just want peace of mind on a side project or early-stage startup.",
          },
          {
            icon: Terminal,
            title: "DIY pg_dump scripts are a chore",
            body: "Writing and maintaining your own cron + pg_dump + cloud-upload script works, until the day you quietly stop checking whether it's still running.",
          },
        ]}
      />

      <ComparisonSection
        toolName="SnapBack"
        competitorLabel="DIY scripts / platform PITR"
        accent={ACCENT}
        rows={[
          { feature: "Setup time", us: "~5 minutes", them: "Hours writing & testing scripts" },
          { feature: "Where backups live", us: "Your own S3 / R2 / B2 bucket", them: "Vendor's servers, or wherever you configured" },
          { feature: "Cost for real retention", us: "$9/mo flat", them: "Tier upgrade, often $25+/mo" },
          { feature: "Failure alerts", us: "Emailed the moment a backup fails", them: "You find out when you actually need it" },
        ]}
        note="Snaplet, a similar independent tool, shut down in 2024 — this space still needs a simple, actively maintained option."
      />

      <SolutionSection
        headline="What SnapBack actually does"
        intro="A focused tool that does one job well: get your data out safely, on a schedule, into storage you control."
        accent={ACCENT}
        bullets={[
          "Connect via connection string — encrypted at rest, tested before it's saved",
          "Backups stream straight to your own S3, Backblaze B2, or Cloudflare R2 bucket — we never hold your data",
          "Daily, every-12-hours, or weekly schedules",
          "Email alert the moment a backup fails, plus a weekly 'all healthy' digest",
          "Automatic retention pruning — keep the last N backups, no manual cleanup",
          "One-click restore instructions generated for your exact backup",
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        note="Every plan is a starting point, not final, and would include a 14-day free trial — no credit card required to start. Your answers below help us get the pricing and limits right before launch."
        plans={[
          { name: "Solo", price: "$9", period: "/mo", features: ["1 database", "Daily backups", "Failure alerts"] },
          { name: "Pro", price: "$19", period: "/mo", features: ["5 databases", "Every-12h schedule", "Priority support"], highlight: true },
          { name: "Agency", price: "$39", period: "/mo", features: ["15 databases", "Every-12h schedule", "Priority support"] },
        ]}
      />

      <FeedbackForm
        toolSlug="snapback"
        toolName="SnapBack"
        accent={ACCENT}
        ctaLabel="Let's build SnapBack"
        questions={[
          {
            key: "database",
            label: "Which database do you use?",
            type: "select",
            required: true,
            allowOther: true,
            options: [
              { value: "supabase", label: "Supabase" },
              { value: "neon", label: "Neon" },
              { value: "turso", label: "Turso" },
              { value: "postgres", label: "Postgres elsewhere" },
              { value: "other", label: "Other" },
            ],
          },
          {
            key: "lost_data",
            label: "Have you ever lost data from a missing backup?",
            type: "select",
            options: [
              { value: "yes", label: "Yes, it happened" },
              { value: "worried", label: "No, but it worries me" },
              { value: "no", label: "No, not a concern" },
            ],
          },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/snapback"
          items={[
            {
              q: "Is SnapBack live yet?",
              a: "Not yet — this page exists to gauge interest before we build it. If enough people want this, we'll build it next and email everyone who signed up.",
            },
            {
              q: "Where do backups actually get stored?",
              a: "In a storage bucket you own and control — AWS S3, Backblaze B2, or Cloudflare R2. SnapBack streams the backup directly there; it never sits on our servers.",
            },
            {
              q: "Does this replace Supabase's or Neon's built-in backups?",
              a: "It complements them. Platform point-in-time recovery is great but is often locked behind a paid tier upgrade. SnapBack gives you an independent, portable copy of your data on a schedule you control, in storage you own.",
            },
            {
              q: "Which databases will be supported?",
              a: "Postgres-compatible databases first — Supabase, Neon, and self-hosted Postgres — via pg_dump. Turso/SQLite support is planned using its own backup APIs.",
            },
            {
              q: "Will you be able to see my data?",
              a: "No. Backups stream directly from your database to your storage bucket. Your connection string is encrypted at rest and used only to run the scheduled backup job.",
            },
            {
              q: "How much will SnapBack cost?",
              a: "Planned pricing starts at $9/month for one database with daily backups, up to $39/month for agencies managing 15 databases. Every plan is meant to include a 14-day free trial with no credit card required — tell us in the questions below if that pricing works for you.",
            },
            {
              q: "How do I restore a Supabase or Neon database from a SnapBack backup?",
              a: "SnapBack generates the exact restore command for your specific backup file — copy it, run it, done. Fully automated one-click restore (no command line) is planned as a fast-follow once the core backup engine ships.",
            },
            {
              q: "How is this different from writing my own pg_dump backup script?",
              a: "A DIY pg_dump + cron + cloud-upload script works fine — until you forget to check whether it's still running. SnapBack is that same idea, hosted, scheduled, monitored, and alerting you the moment a backup actually fails.",
            },
            {
              q: "Does SnapBack support MySQL or only Postgres?",
              a: "Postgres-compatible databases (Supabase, Neon, self-hosted Postgres) and Turso/SQLite are the initial scope. MySQL support would depend on demand — mention it in the form below if that's what you need.",
            },
          ]}
        />
      </div>
    </>
  );
}
