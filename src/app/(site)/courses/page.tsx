import type { Metadata } from "next";
import ExploreHero from "@/components/courses/ExploreHero";
import CoursesExplorer from "@/components/courses/CoursesExplorer";
import Pagination from "@/components/ui/Pagination";
import CTABanner from "@/components/ui/CTABanner";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Courses",
};

export default async function ExploreCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { category: true, mentor: true },
    orderBy: { order: "asc" },
  });
  const items = courses.map(mapCourse);

  return (
    <>
      <ExploreHero />
      <section id="grid" className="container-page py-10 sm:py-14">
        <h2 className="mb-6 text-2xl font-bold text-brand-ink sm:text-3xl">Explore Courses</h2>
        <CoursesExplorer items={items} />
        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-brand-muted">No courses published yet.</p>
        )}
        {items.length > 0 && <Pagination total={3} />}
      </section>
      <CTABanner />
    </>
  );
}
