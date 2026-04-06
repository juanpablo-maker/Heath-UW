import { notFound } from "next/navigation";
import { INDUSTRY_SLUGS, isIndustrySlug } from "@/lib/content/industries";
import { IndustryDetailClient } from "./IndustryDetailClient";

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }));
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isIndustrySlug(slug)) {
    notFound();
  }

  return <IndustryDetailClient slug={slug} />;
}
