import { ShoppingBag, RotateCcw, Store, BadgeDollarSign, Download, MessageSquare, Clock, Upload, PackageX, Tag, FileSpreadsheet, PackageSearch, Tags, Eye, History } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";
import { LabsHero } from "@/components/labs/LabsHero";
import { HowItWorksSection } from "@/components/labs/HowItWorksSection";
import { PainPointSection } from "@/components/labs/PainPointSection";
import { SolutionSection } from "@/components/labs/SolutionSection";
import { ComparisonSection } from "@/components/labs/ComparisonSection";
import { PricingPreview } from "@/components/labs/PricingPreview";
import { FeedbackForm } from "@/components/labs/FeedbackForm";
import { ShopifyToolsMockup } from "@/components/labs/mockups/ShopifyToolsMockup";
import { ToolFAQ } from "@/components/tools/ToolFAQ";

const ACCENT = "#1B63E6";

export function ShopifyToolsClient() {
  return (
    <>
      <LabsHeader accent={ACCENT} honestyStripText="This page validates demand — tell us which workflow hurts most, and we build that one first." />

      <LabsHero
        accent={ACCENT}
        eyebrowIcon={ShoppingBag}
        eyebrowText="For Shopify merchants"
        ctaLabel="Let's Build This"
        headline={
          <>
            You&apos;re losing hours a week to <span style={{ color: ACCENT }}>manual Shopify busywork</span>.
          </>
        }
        subheadline={
          <>
            We&apos;re building a focused app that automates the one repetitive workflow wasting the most of your time — bulk price updates, supplier CSV
            imports, low-stock alerts, or order tagging. <strong style={{ color: "#1A1A2E" }}>Tell us which one.</strong>
          </>
        }
        trustBullets={[
          { icon: RotateCcw, text: "Scheduled auto-rollback" },
          { icon: Store, text: "Billed through Shopify" },
          { icon: BadgeDollarSign, text: "From $9.99/mo" },
        ]}
        mockup={<ShopifyToolsMockup accent={ACCENT} />}
      />

      <HowItWorksSection
        accent={ACCENT}
        headline="Install, tell us your biggest pain, automate it"
        intro="One focused workflow, done properly — through Shopify's own APIs, billed on your existing Shopify invoice."
        steps={[
          { num: "01", icon: Download, title: "Install from the App Store", body: "A normal Shopify install with a guided setup — no code, no scripts, live in minutes." },
          { num: "02", icon: MessageSquare, title: "Tell us your biggest pain", body: "Pricing, supplier CSVs, low stock, or order tagging — we build whichever one merchants need most first." },
          { num: "03", icon: RotateCcw, title: "Automate it, safely", body: "Dry-run preview before anything touches live data, plus scheduled auto-rollback and a full history log." },
        ]}
      />

      <PainPointSection
        accent={ACCENT}
        headline="Repetitive Shopify workflows eat your week"
        intro="The tedious, recurring tasks of running a store rarely make it onto anyone's roadmap — but they add up to real hours every week."
        pains={[
          { icon: Clock, title: "Bulk price changes are all-manual", body: "Running a sale means editing prices one by one, then remembering to change them back — or building your own script to do it." },
          { icon: Upload, title: "Supplier CSVs never match Shopify's format", body: "Every supplier exports data differently. Reformatting and re-importing product updates is a recurring, error-prone chore." },
          { icon: PackageX, title: "Low-stock alerts mean checking manually", body: "Without automated alerts, running out of a bestseller is something you find out about from a customer complaint." },
        ]}
      />

      <SolutionSection
        accent={ACCENT}
        headline="One workflow, done exceptionally well"
        intro="Rather than another bloated all-in-one app, this does one job — whichever one merchants tell us matters most — better than anything else on the App Store."
        features={[
          { icon: Tag, title: "Bulk price editor + auto-rollback", body: "Schedule a sale and let it revert automatically — the feature competitors leave manual." },
          { icon: FileSpreadsheet, title: "Supplier CSV mapper", body: "Remembers your exact column mapping so re-imports are a repeatable one-click job." },
          { icon: PackageSearch, title: "Low-stock digest", body: "Emailed with a ready-to-send reorder sheet, not just a bare notification." },
          { icon: Tags, title: "Order-tagging rules engine", body: "Powers your other automations by tagging orders consistently as they come in." },
          { icon: Eye, title: "Dry-run preview", body: "See exactly what will change before anything touches live data." },
          { icon: History, title: "Full history log", body: "One-click rollback of any past change — nothing is ever a one-way door." },
        ]}
      />

      <ComparisonSection
        accent={ACCENT}
        toolName="This tool"
        headline="This tool vs. doing it manually"
        intro="EZ Fulfill, a similar single-workflow app, reached $8k MRR and 1,200 stores doing just one thing well."
        competitorLabel="Manual / generic apps"
        rows={[
          { feature: "Setup", us: "Install from the Shopify App Store in minutes", them: "Manual process or juggling several apps" },
          { feature: "Scheduled rollback", us: "Built in — set it and forget it", them: "Rare; usually a manual revert" },
          { feature: "Pricing", us: "$9.99–19.99/mo, billed through Shopify", them: "Varies, often bundled into pricier suites" },
          { feature: "Support", us: "Direct from the builder", them: "Slow support is a common complaint on competing apps" },
        ]}
      />

      <PricingPreview
        accent={ACCENT}
        intro="Billed through Shopify's Billing API. Free for the first 50 stores that install it, grandfathered even after billing turns on."
        plans={[
          { name: "Basic", price: "$9.99", period: "/mo", tagline: "For focused single-workflow use", features: ["Up to 500 variants/job", "Core workflow"] },
          { name: "Unlimited", price: "$19.99", period: "/mo", tagline: "For larger, busier catalogs", features: ["Unlimited variants", "Scheduling included"], highlight: true, badge: "Most Popular" },
        ]}
      />

      <FeedbackForm
        toolSlug="shopify-tools"
        toolName="this tool"
        accent={ACCENT}
        ctaLabel="Let's Build This"
        waitlistHeadline="Which workflow should we build?"
        waitlistIntro="Takes 10 seconds, no commitment. Tell us your biggest pain and we'll build that first — one email when it ships."
        emailPlaceholder="you@shop.com"
        step1Field={{
          kind: "pills",
          key: "painPick",
          label: "Which of these wastes the most of your time?",
          options: [
            { value: "bulk_price", label: "Bulk price edits" },
            { value: "supplier_csv", label: "Supplier CSV imports" },
            { value: "low_stock", label: "Low-stock alerts" },
            { value: "order_tagging", label: "Order tagging" },
            { value: "other", label: "Something else" },
          ],
        }}
        step2Fields={[
          { kind: "pills", key: "catalog", label: "How many products/variants do you manage?", options: [{ value: "<100", label: "Under 100" }, { value: "100-1000", label: "100–1,000" }, { value: "1000+", label: "1,000+" }] },
          { kind: "textarea", key: "additionalFeedback", label: "Anything else you'd want it to do?", optional: true },
        ]}
      />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 20px" }}>
        <ToolFAQ
          toolUrl="/labs/shopify-tools"
          items={[
            { q: "Is this live yet?", a: "Not yet — this page exists to gauge interest and figure out which workflow to build first. If enough merchants respond, we'll build it and email everyone who signed up." },
            { q: "What exactly will it do?", a: "That's what we're figuring out with your help. Rather than guess, we're asking merchants directly which of the four candidate workflows — bulk pricing, supplier CSV imports, low-stock alerts, or order tagging — hurts the most, and building that one properly." },
            { q: "Will it work with my theme and setup?", a: "Yes — it will use Shopify's official Admin API and Bulk Operations API, which work the same regardless of theme." },
            { q: "How will billing work?", a: "Through Shopify's own Billing API, so it shows up on your existing Shopify invoice — no separate credit card to manage." },
            { q: "Will my store data be safe?", a: "The app only requests the API scopes it needs for the specific workflow (e.g. product/inventory access), follows Shopify's standard OAuth app review requirements, and implements the required GDPR data webhooks from day one." },
            { q: "Will it conflict with my other Shopify apps?", a: "It's built to do one job — pricing, CSV import, stock alerts, or order tagging — through Shopify's standard Admin API, the same way any well-behaved app integrates. It shouldn't need exclusive access to anything another app already uses." },
            { q: "Do I need to be a developer to use it?", a: "No. It's a normal Shopify App Store install with a guided setup — no code, no CSV command-line tools, no custom scripts." },
            { q: "What's a supplier CSV product import mapper?", a: "A tool that remembers exactly how your specific supplier's spreadsheet columns map to Shopify's product fields, so re-importing updated stock or pricing from that supplier is a repeatable one-click job instead of manual reformatting every time." },
          ]}
        />
      </div>
    </>
  );
}
