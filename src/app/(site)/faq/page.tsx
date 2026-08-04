import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ's",
  description: "Answers to common questions about Academy's live courses, batches, payments, and philanthropy program.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => f.answer)
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="FAQ's"
          description="Everything you need to know about how Academy's live courses, batches, and payments work."
        />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>
      <CTABanner />
    </>
  );
}
