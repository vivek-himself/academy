"use client";

import { useState } from "react";
import CourseCard from "@/components/ui/CourseCard";
import type { mapCourse } from "@/lib/mappers";

type Course = ReturnType<typeof mapCourse> & { slug: string };

export default function BrowseTopCourses({ items, categories }: { items: Course[]; categories: string[] }) {
  const [active, setActive] = useState(categories[0]);
  const filtered = items.filter((course) => course.category === active);

  if (categories.length === 0) return null;

  return (
    <section className="container-page py-10 sm:py-14">
      <h2 className="mb-6 text-center text-2xl font-bold text-brand-ink sm:text-3xl">Browse Our Top Courses</h2>
      <div className="mb-8 flex flex-wrap justify-center gap-6 border-b border-brand-border">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              active === tab ? "text-brand-pink" : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {tab}
            {active === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-pink" />}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-brand-muted">No courses in {active} yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
