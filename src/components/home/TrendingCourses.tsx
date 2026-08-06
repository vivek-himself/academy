"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import type { mapCourse } from "@/lib/mappers";
import { useCurrency } from "@/components/providers/CurrencyProvider";

type Course = ReturnType<typeof mapCourse> & { slug: string };

export default function TrendingCourses({ title, featured, items }: { title: string; featured: Course; items: Course[] }) {
  const { format } = useCurrency();
  return (
    <section className="container-page py-10 sm:py-14">
      <h2 className="mb-6 text-center text-2xl font-bold text-brand-ink sm:text-3xl">{title}</h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Link
          href={`/courses/${featured.slug}`}
          className="group relative flex min-h-[320px] items-end overflow-hidden rounded-2xl bg-brand-ink"
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <h3 className="relative z-10 p-6 text-xl font-bold text-white">{featured.title}</h3>
        </Link>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-brand-border bg-white"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h4 className="line-clamp-2 text-xs font-semibold text-brand-ink">{course.title}</h4>
                <p className="mt-1 text-[11px] text-brand-muted">By {course.mentor}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <StarRating rating={course.rating} size={11} />
                  <span className="text-[10px] text-brand-muted">({course.reviews})</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-brand-ink">{format(course.price)}</span>
                  {course.originalPrice && (
                    <span className="text-[11px] text-brand-muted line-through">{format(course.originalPrice)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
