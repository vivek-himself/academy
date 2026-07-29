import { notFound } from "next/navigation";
import GrowthHero from "@/components/growth/GrowthHero";
import WhatToExpect from "@/components/growth/WhatToExpect";
import QuickFacts from "@/components/growth/QuickFacts";
import WhatBuyersSay from "@/components/growth/WhatBuyersSay";
import Benefits from "@/components/growth/Benefits";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";
import { mapGrowthPage } from "@/lib/mappers";

export const dynamic = "force-dynamic";

const VALID_SLUGS = ["cv-rebrand", "linkedin-optimisation", "job-search-consultation"];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function GrowthLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [dbPage, testimonials, faqs] = await Promise.all([
    prisma.growthPage.findUnique({ where: { slug } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!dbPage) notFound();

  const page = mapGrowthPage(dbPage);

  return (
    <>
      <GrowthHero page={page} />
      <WhatToExpect page={page} />
      <QuickFacts page={page} />
      <WhatBuyersSay testimonials={testimonials} />
      <Benefits page={page} />
      <section className="container-page py-10 sm:py-14">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="mt-8">
          <FaqAccordion items={faqs} />
        </div>
      </section>
      <CTABanner />
    </>
  );
}
