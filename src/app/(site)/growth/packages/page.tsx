import type { Metadata } from "next";
import FastTrackHero from "@/components/growth/FastTrackHero";
import AsSeenOn from "@/components/home/AsSeenOn";
import PricingTable from "@/components/growth/PricingTable";
import WhatBuyersSay from "@/components/growth/WhatBuyersSay";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Packages — Academy",
};

export default async function PackagesPage() {
  const [plans, trustLogos, testimonials, faqs] = await Promise.all([
    prisma.pricingPlan.findMany({ orderBy: { order: "asc" } }),
    prisma.trustLogo.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
  ]);

  const mappedPlans = plans.map((p) => ({
    name: p.name,
    tagline: p.tagline ?? undefined,
    price: p.price,
    recommended: p.recommended,
    features: safeJsonParse<{ label: string; included: boolean }[]>(p.featuresJson, []),
  }));

  return (
    <>
      <FastTrackHero />
      <AsSeenOn logos={trustLogos} />
      <PricingTable plans={mappedPlans} />
      <WhatBuyersSay testimonials={testimonials} />
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
