"use client";

import Link from "next/link";
import {
  CTASection,
  FeatureSection,
  HeroSection,
  IndustryCard,
  IndustryGrid,
} from "@/components/blocks";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { useI18n } from "@/components/providers/LanguageProvider";
import { ROUTES } from "@/lib/routes/marketing";

export default function SectoresPage() {
  const { dict } = useI18n();
  const s = dict.pages.sectores;

  return (
    <>
      <HeroSection kicker={s.heroKicker} title={s.title} subtitle={s.subtitle} />

      <Section>
        <Container>
          <Text size="lg" className="mx-auto max-w-3xl text-center">
            {s.intro}
          </Text>
          <IndustryGrid className="mt-14">
            {s.industries.map((ind) => (
              <IndustryCard
                key={ind.slug}
                title={ind.title}
                description={ind.description}
                href={ROUTES.industries.detail(ind.slug)}
              />
            ))}
          </IndustryGrid>
        </Container>
      </Section>

      <FeatureSection
        kicker={s.feature.kicker}
        title={s.feature.title}
        description={s.feature.description}
        bullets={s.feature.bullets}
      />

      <CTASection
        kicker={s.cta.kicker}
        title={s.cta.title}
        titleAccent={s.cta.titleAccent}
        description={s.cta.description}
        primaryHref={ROUTES.demo}
        primaryLabel={s.cta.primary}
        secondaryHref={ROUTES.desk}
        secondaryLabel={s.cta.secondary}
      />

      <Section background="subtle" density="compact">
        <Container size="prose" className="text-center">
          <Link
            href={ROUTES.home}
            className="text-sm font-medium text-accent hover:underline"
          >
            {dict.marketingLayout.backHome}
          </Link>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
