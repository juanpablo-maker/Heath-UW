"use client";

import { CapabilitySection } from "@/components/CapabilitySection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SocialProof } from "@/components/SocialProof";
import { useI18n } from "@/components/providers/LanguageProvider";
import { FadeInSection } from "@/components/ui/FadeInSection";

export default function Home() {
  const { dict } = useI18n();
  const panelTypes = ["intake", "decision", "portfolio"] as const;

  return (
    <>
      <Hero />
      <FadeInSection>
        <ComparisonSection />
      </FadeInSection>
      {dict.landing.capabilities.sections.map((section, index) => (
        <FadeInSection key={section.title}>
          <CapabilitySection
            title={section.title}
            paragraph={section.paragraph}
            bullets={section.bullets}
            mockPanel={panelTypes[index] ?? "intake"}
            imageRight={index % 2 === 0}
            surface={index % 2 === 1 ? "band" : "default"}
          />
        </FadeInSection>
      ))}
      <FadeInSection>
        <ProcessSteps />
      </FadeInSection>
      <FadeInSection>
        <SocialProof />
      </FadeInSection>
      <FadeInSection>
        <FinalCTA />
      </FadeInSection>
      <Footer />
    </>
  );
}
