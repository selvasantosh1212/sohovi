import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PublicNav } from "@/components/landing/PublicNav";
import { Hero } from "@/components/landing/Hero";
import { BrandStrip } from "@/components/landing/BrandStrip";
import { ProofStrip } from "@/components/landing/ProofStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { CapabilityPillars } from "@/components/landing/CapabilityPillars";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { PrivacySection } from "@/components/landing/PrivacySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sohovi",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/sohovi.svg` },
      email: "hello@sohovi.com",
      sameAs: [`${SITE_URL}`],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Sohovi",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Privacy-first data quality platform that profiles, scores, and validates CSV and Excel files entirely in the browser. Zero server upload.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "5 data assets, unlimited profiling, 5 DQ rules per asset" },
        { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD", billingIncrement: "month", description: "Unlimited assets, AI DQ rule suggestions, PDF reports" },
        { "@type": "Offer", name: "Business", price: "59", priceCurrency: "USD", billingIncrement: "month", description: "Team collaboration, business units, cross-column validations, priority support" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        { "@type": "Question", name: "Is my data actually safe? How do I know it never leaves my browser?", acceptedAnswer: { "@type": "Answer", text: "When you drop a file into Sohovi, it's read using the browser's File API — no network request is made. The actual analysis runs inside a Web Worker, which is a sandboxed browser thread that cannot make outbound HTTP calls. You can verify this yourself: open DevTools → Network tab → drop a file in Sohovi. You'll see zero requests containing your file data." } },
        { "@type": "Question", name: "How does Sohovi compare to traditional data quality tools?", acceptedAnswer: { "@type": "Answer", text: "Most established DQ platforms are built for enterprise IT departments — they require months of implementation, dedicated ops teams, and significant annual budgets. Sohovi is built for data analysts and small teams who need to trust their data now. You can be scoring your first dataset in under 10 minutes with zero setup." } },
        { "@type": "Question", name: "What file types and sizes does Sohovi support?", acceptedAnswer: { "@type": "Answer", text: "CSV and Excel (.xlsx, .xls) files up to 200MB. For very large files, Sohovi automatically samples up to 100,000 rows for profiling while still applying rules across all rows. JSON and Parquet support are on the roadmap." } },
        { "@type": "Question", name: "Does the Free plan actually work, or is it intentionally limited?", acceptedAnswer: { "@type": "Answer", text: "The Free plan is genuinely useful for individuals. You get 5 data assets, unlimited profiling runs, 5 DQ rules per asset, and 7-day run history. It's not a 14-day trial — it's free forever for solo use." } },
        { "@type": "Question", name: "Does the Business plan have a free trial?", acceptedAnswer: { "@type": "Answer", text: "Yes — Business includes a 7-day free trial with no credit card required. You get full access to all Business features. If you don't upgrade by the end of the trial, you move to the Free plan automatically — no charges." } },
        { "@type": "Question", name: "How does the DQ scoring work? Can I trust the numbers?", acceptedAnswer: { "@type": "Answer", text: "Each of the 10 DQ dimensions has a defined formula. Completeness = (non-null rows / total rows) × 100. Validity = (rows matching your rule / total rows) × 100. Every score shows exactly which rule was applied and how many rows failed — there are no proprietary algorithms or opaque weighting." } },
        { "@type": "Question", name: "Can I use Sohovi for regulated industries?", acceptedAnswer: { "@type": "Answer", text: "Yes. Because your raw data never leaves your browser, there is no data transfer to our servers, which means Sohovi doesn't become a data processor under GDPR for your customer data. Legal teams in healthcare, finance, and HR typically approve Sohovi in 24 hours." } },
      ],
    },
  ],
};

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <PublicNav />
      <main className="flex-1">
        <Hero />
        <BrandStrip />
        <ProofStrip />
        <ProblemSection />
        <CapabilityPillars />
        <HowItWorks />
        <UseCasesSection />
        <PrivacySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
