import type { Metadata } from "next";
import Image from "next/image";
import { Play } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/ui/TestimonialCard";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Success Stories — Academy",
};

const thumbnails = Array.from({ length: 6 }).map(
  () => "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80"
);

export default async function SuccessStoriesPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="container-page py-12 sm:py-16">
        <SectionHeading
          title="Success"
          highlight="Stories"
          description="Our Mentors Are Seasoned Professionals With Real-World Experience. They Bring Practical Insights And Proven Strategies To Help You Succeed In Your Marketing Career."
        />

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {thumbnails.map((src, i) => (
            <div key={i} className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-xl sm:w-40">
              <Image src={src} alt="Success story" fill className="object-cover" />
              <span className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-brand-pink">
                <Play size={11} fill="currentColor" />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} quote={t.quote} name={t.name} role={t.role} avatar={t.avatarUrl ?? undefined} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark">
            Show Me More
          </button>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
