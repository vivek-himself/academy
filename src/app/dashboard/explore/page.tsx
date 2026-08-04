import CoursesExplorer from "@/components/courses/CoursesExplorer";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export default async function DashboardExplorePage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { category: true, mentor: true },
    orderBy: { order: "asc" },
  });
  const items = courses.map(mapCourse);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-ink">Explore Courses</h1>
      <CoursesExplorer items={items} />
      {items.length === 0 && <p className="py-16 text-center text-sm text-brand-muted">No courses published yet.</p>}
    </div>
  );
}
