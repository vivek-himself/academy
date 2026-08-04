import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import { getProgress } from "@/lib/enrollment";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: { course: { include: { category: true, mentor: true } } },
    orderBy: { lastAccessedAt: "desc" },
  });

  const withProgress = enrollments.map((e) => ({
    enrollment: e,
    progress: getProgress(e.completedModulesJson, e.course.modulesCount),
  }));

  const continueWatching = withProgress.filter((e) => e.progress.percent > 0);
  const upcoming = withProgress.filter((e) => e.progress.percent === 0);

  if (enrollments.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-xl font-bold text-brand-ink">My Courses</h1>
        <div className="rounded-2xl border border-brand-border bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-bold text-brand-ink">You&apos;re not enrolled in any courses yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">
            Browse the catalog and find a course to get started.
          </p>
          <Link
            href="/dashboard/explore"
            className="mt-5 inline-block rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-brand-ink">My Courses</h1>

      {continueWatching.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-brand-ink">Continue Watching</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {continueWatching.map(({ enrollment, progress }) => (
              <DashboardCourseCard key={enrollment.id} course={enrollment.course} percent={progress.percent} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-brand-ink">Upcoming Courses</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(({ enrollment, progress }) => (
              <DashboardCourseCard key={enrollment.id} course={enrollment.course} percent={progress.percent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
