import { Clock, Upload, PackageX } from "lucide-react";
import { LabsHero } from "@/components/labs/LabsHero";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#B45309";

export function ShopifyToolsClient() {
  return (
    <>
      <LabsHero
        eyebrow="For Shopify merchants"
        accent={ACCENT}
        ctaLabel="Let's build this"
        headline={
          <>
            You&apos;re losing hours a week to <span style={{ color: ACCENT }}>manual Shopify busywork</span>.
          </>
        }
        subheadline="We're building a focused Shopify app that automates the one repetitive workflow wasting the most of your time — bulk price updates, supplier CSV imports, low-stock alerts, or order tagging. Tell us which one."
      />

      <PainPointSection
        headline="Repetitive Shopify workflows eat your week"
        intro="The tedious, recurring tasks of running a store rarely make it onto anyone's roadmap — but they add up to real hours every week."
        pains={[
          {
            icon: Clock,
            title: "Bulk price changes are all-manual",
            body: "Running a sale means editing prices one by one, then remembering to change them back — or building your own script to do it.",
          },
          {
            icon: Upload,
            title: "Supplier CSVs never match Shopify's format",
            body: "Every supplier exports data differently. Reformatting and re-importing product updates is a recurring, error-prone chore.",
          },
          {
            icon: PackageX,
            title: "Low-stock alerts mean checking manually",
            body: "Without automated alerts, running out of a bestseller is something you find out about from a customer complaint.",
          },
        ]}
      />

      <ComparisonSection
        toolName="This tool"
        competitorLabel="Doing it manually / generic apps"
        accent={ACCENT}
        rows={[
          { feature: "Setup", us: "Install from the Shopify App Store in minutes", them: "Manual process or juggling several apps" },
          { feature: "Scheduled rollback", us: "Built in — set it and forget it", them: "Rare; usually a manual revert" },
          { feature: "Pricing", us: "$9.99–19.99/mo, billed through Shopify", them: "Varies, often bundled into pricier suites" },
          { feature: "Support", us: "Direct from the builder", them: "Slow support is a common complaint on competing apps" },
        ]}
        note="EZ Fulfill, a similar single-workflow app, reached $8k MRR and 1,200 stores doing just one thing well — automating tracking-number uploads."
      />

      <SolutionSection
        headline="One workflow, done exceptionally well"
        intro="Rather than another bloated all-in-one app, this does one job — whichever one merchants tell us matters most — better than anything else on the App Store."
        accent={ACCENT}
        bullets={[
          "Bulk price editor with scheduled auto-rollback — the feature competitors leave manual",
          "Supplier CSV → product mapper that remembers your exact column mapping",
          "Low-stock digest emailed with a ready-to-send reorder sheet",
          "Order-tagging rules engine that powers your other automations",
          "Dry-run preview before anything touches live data",
          "Full history log with one-click rollback of any past change",
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        note="Billed through Shopify's Billing API — no separate card needed. Planned: free for the first 50 stores that install it, grandfathered in even after billing turns on for everyone else."
        plans={[
          { name: "Basic", price: "$9.99", period: "/mo", features: ["Up to 500 variants/job", "Core workflow"] },
          { name: "Unlimited", price: "$19.99", period: "/mo", features: ["Unlimited variants", "Scheduling included"], highlight: true },
        ]}
      />

      <FeedbackForm
        toolSlug="shopify-tools"
        toolName="this tool"
        accent={ACCENT}
        ctaLabel="Let's build this"
        questions={[
          {
            key: "biggest_pain",
            label: "Which of these wastes the most of your time?",
            type: "select",
            required: true,
            allowOther: true,
            options: [
              { value: "bulk_price", label: "Bulk price edits & sale scheduling" },
              { value: "supplier_csv", label: "Supplier CSV imports" },
              { value: "low_stock", label: "Low-stock alerts & reordering" },
              { value: "order_tagging", label: "Order tagging rules" },
              { value: "other", label: "Something else" },
            ],
          },
          {
            key: "catalog_size",
            label: "How many products/variants do you manage?",
            type: "select",
            options: [
              { value: "<100", label: "Under 100" },
              { value: "100-1000", label: "100–1,000" },
              { value: "1000+", label: "1,000+" },
            ],
          },
        ]}
      />

      <div className="mx-auto max-w-[820px] px-6 pb-20">
        <ToolFAQ
          toolUrl="/labs/shopify-tools"
          items={[
            {
              q: "Is this live yet?",
              a: "Not yet — this page exists to gauge interest and figure out which workflow to build first. If enough merchants respond, we'll build it and email everyone who signed up.",
            },
            {
              q: "What exactly will it do?",
              a: "That's what we're figuring out with your help. Rather than guess, we're asking merchants directly which of the four candidate workflows — bulk pricing, supplier CSV imports, low-stock alerts, or order tagging — hurts the most, and building that one properly.",
            },
            {
              q: "Will it work with my theme and setup?",
              a: "Yes — it will use Shopify's official Admin API and Bulk Operations API, which work the same regardless of theme.",
            },
            {
              q: "How will billing work?",
              a: "Through Shopify's own Billing API, so it shows up on your existing Shopify invoice — no separate credit card to manage.",
            },
            {
              q: "Will my store data be safe?",
              a: "The app only requests the API scopes it needs for the specific workflow (e.g. product/inventory access), follows Shopify's standard OAuth app review requirements, and implements the required GDPR data webhooks from day one.",
            },
            {
              q: "Will it conflict with my other Shopify apps?",
              a: "It's built to do one job — pricing, CSV import, stock alerts, or order tagging — through Shopify's standard Admin API, the same way any well-behaved app integrates. It shouldn't need exclusive access to anything another app already uses.",
            },
            {
              q: "Do I need to be a developer to use it?",
              a: "No. It's a normal Shopify App Store install with a guided setup — no code, no CSV command-line tools, no custom scripts.",
            },
            {
              q: "What's a supplier CSV product import mapper?",
              a: "A tool that remembers exactly how your specific supplier's spreadsheet columns map to Shopify's product fields, so re-importing updated stock or pricing from that supplier is a repeatable one-click job instead of manual reformatting every time.",
            },
          ]}
        />
      </div>
    </>
  );
}
