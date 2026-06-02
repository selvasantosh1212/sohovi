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

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
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
