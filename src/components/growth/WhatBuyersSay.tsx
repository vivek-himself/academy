import TestimonialCard from "@/components/ui/TestimonialCard";

type Testimonial = { quote: string; name: string; role: string; avatarUrl?: string | null };

export default function WhatBuyersSay({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="container-page py-10 text-center sm:py-14">
      <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">What Buyers Have To Say</h2>
      <div className="mt-10 columns-1 gap-6 text-left sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} quote={t.quote} name={t.name} role={t.role} avatar={t.avatarUrl ?? undefined} />
        ))}
      </div>
      <button className="mt-4 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark">
        Show Me More
      </button>
    </section>
  );
}
