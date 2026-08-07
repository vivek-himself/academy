import type { Metadata } from "next";
import ExploreHero from "@/components/courses/ExploreHero";
import CoursesExplorer from "@/components/courses/CoursesExplorer";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Courses",
};

export default async function ExploreCoursesPage() {
  const [courses, heroImageBlock] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      include: { category: true, mentor: true },
      orderBy: { order: "asc" },
    }),
    prisma.contentBlock.findUnique({ where: { key: "courses_explore_hero_image" } }),
  ]);
  const items = courses.map(mapCourse);
  const heroImageUrl = safeJsonParse(heroImageBlock?.dataJson, "");

  return (
    <>
      <ExploreHero imageUrl={heroImageUrl} />
      <section id="grid" className="container-page py-10 sm:py-14">
        <h2 className="mb-6 text-2xl font-bold text-brand-ink sm:text-3xl">Explore Courses</h2>
        <CoursesExplorer items={items} />
        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-brand-muted">No courses published yet.</p>
        )}
      </section>
      <CTABanner />
    </>
  );
}
