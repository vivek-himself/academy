import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ's — Academy",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="FAQ's"
          description="There Are Many Variations Of Passages Of Lorem Ipsum Available, But The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even"
        />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>
      <CTABanner />
    </>
  );
}
