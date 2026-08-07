import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import { getCompletedModules, getProgress } from "@/lib/enrollment";
import { isProfileComplete, getProfileCompletionPercent, getMissingProfileFields } from "@/lib/profile";
import { safeJsonParse } from "@/lib/json";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import NotificationsBell, { type NotificationItem } from "@/components/dashboard/NotificationsBell";
import ProfileIncompleteBanner from "@/components/dashboard/ProfileIncompleteBanner";
import AvatarProgressRing from "@/components/dashboard/AvatarProgressRing";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default async function DashboardOverviewPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const [user, enrollments, notificationRecipients] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.enrollment.findMany({
      where: { userId: session.userId },
      include: { course: { include: { category: true, mentor: true } } },
      orderBy: { lastAccessedAt: "desc" },
    }),
    prisma.notificationRecipient.findMany({
      where: { userId: session.userId },
      include: { notification: true },
      orderBy: { notification: { createdAt: "desc" } },
      take: 6,
    }),
  ]);
  if (!user) redirect("/login");

  const withProgress = enrollments.map((e) => ({
    enrollment: e,
    progress: getProgress(e.completedModulesJson, e.course.modulesCount),
  }));

  const activeCourses = withProgress.filter((e) => e.progress.percent > 0 && e.progress.percent < 100);
  const continueCourse = withProgress[0];

  const categoryStats = new Map<string, { completed: number; total: number }>();
  for (const { enrollment, progress } of withProgress) {
    const name = enrollment.course.category?.name ?? "General";
    const existing = categoryStats.get(name) ?? { completed: 0, total: 0 };
    existing.completed += progress.completedCount;
    existing.total += progress.total;
    categoryStats.set(name, existing);
  }

  const mentorRows = withProgress
    .filter((e) => e.enrollment.course.mentor)
    .slice(0, 6)
    .map((e) => ({
      mentor: e.enrollment.course.mentor!,
      courseTitle: e.enrollment.course.title,
      courseSlug: e.enrollment.course.slug,
      date: e.enrollment.enrolledAt,
    }));

  const notifications: NotificationItem[] = notificationRecipients.map((r) => ({
    id: r.id,
    title: r.notification.title,
    message: r.notification.body,
    when: timeAgo(r.notification.createdAt),
  }));
  const unreadNotificationCount = notificationRecipients.filter((r) => !r.readAt).length;

  const hasEnrollments = enrollments.length > 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const missing = getMissingProfileFields(user);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        {!isProfileComplete(user) && <ProfileIncompleteBanner missing={missing} />}

        {!hasEnrollments ? (
          <div className="rounded-2xl border border-brand-border bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-brand-ink">You&apos;re not enrolled in any courses yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">
              Browse the catalog and find a course to get started — your progress will show up here.
            </p>
            <Link
              href="/dashboard/explore"
              className="mt-5 inline-block rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <>
            {categoryStats.size > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[...categoryStats.entries()].slice(0, 3).map(([name, stat]) => (
                  <div key={name} className="flex items-center gap-3 rounded-2xl border border-brand-border bg-white p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 text-xs font-bold text-brand-pink">
                      {stat.completed}/{stat.total}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-brand-ink">{name}</p>
                      <p className="text-[11px] text-brand-muted">Watched</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-brand-ink">Your Active Courses</h2>
              </div>
              {activeCourses.length === 0 ? (
                <p className="rounded-2xl border border-brand-border bg-white px-5 py-8 text-center text-sm text-brand-muted">
                  No courses in progress right now.
                </p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {activeCourses.map(({ enrollment, progress }) => (
                    <div key={enrollment.id} className="w-64 shrink-0">
                      <DashboardCourseCard course={enrollment.course} percent={progress.percent} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {mentorRows.length > 0 && (
              <div className="rounded-2xl border border-brand-border bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-brand-ink">Your Mentor</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-wide text-brand-muted">
                        <th className="pb-2 font-bold">Instructor</th>
                        <th className="pb-2 font-bold">Course</th>
                        <th className="pb-2 font-bold">Enrolled</th>
                        <th className="pb-2 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentorRows.map((row, i) => (
                        <tr key={i} className="border-t border-brand-border">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              {row.mentor.imageDesktopUrl ? (
                                <Image
                                  src={row.mentor.imageDesktopUrl}
                                  alt={row.mentor.name}
                                  width={28}
                                  height={28}
                                  className="h-7 w-7 rounded-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-purple text-[11px] font-semibold text-white">
                                  {row.mentor.name.charAt(0)}
                                </span>
                              )}
                              <span className="font-medium text-brand-ink">{row.mentor.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-brand-muted">{row.courseTitle}</td>
                          <td className="py-2.5 text-brand-muted">{row.date.toLocaleDateString()}</td>
                          <td className="py-2.5 text-right">
                            <Link
                              href={`/dashboard/courses/${row.courseSlug}`}
                              className="rounded-full bg-brand-pink/10 px-3 py-1.5 text-xs font-semibold text-brand-pink hover:bg-brand-pink/20"
                            >
                              Show Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-brand-border bg-white p-5 text-center">
          <div className="mx-auto">
            <AvatarProgressRing percent={getProfileCompletionPercent(user)}>
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-purple text-lg font-semibold text-white">
                  {user.name.charAt(0)}
                </span>
              )}
            </AvatarProgressRing>
          </div>
          {!isProfileComplete(user) && (
            <p className="mt-1.5 text-[11px] font-semibold text-brand-pink">
              Profile {getProfileCompletionPercent(user)}% complete
            </p>
          )}
          <p className="mt-3 text-sm font-bold text-brand-ink">
            {greeting} {user.name.split(" ")[0]}
          </p>
          <p className="mt-1 text-xs text-brand-muted">Continue your journey and achieve your target</p>
          <div className="mt-4 flex justify-center">
            <NotificationsBell notifications={notifications} unreadCount={unreadNotificationCount} />
          </div>
        </div>

        {continueCourse && (
          <div className="rounded-2xl border border-brand-border bg-white p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-muted">Continue</p>
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-brand-surface">
              {continueCourse.enrollment.course.imageDesktopUrl && (
                <Image
                  src={continueCourse.enrollment.course.imageDesktopUrl}
                  alt={continueCourse.enrollment.course.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <h3 className="text-sm font-bold text-brand-ink">{continueCourse.enrollment.course.title}</h3>
            {continueCourse.enrollment.course.mentor && (
              <p className="mt-1 text-xs text-brand-muted">{continueCourse.enrollment.course.mentor.name}</p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {safeJsonParse<{ title: string; duration: string }[]>(continueCourse.enrollment.course.modulesJson, []).map(
                (m, i) => {
                  const completed = getCompletedModules(continueCourse.enrollment.completedModulesJson).includes(i);
                  return (
                    <div key={i} className="flex items-center justify-between gap-2 text-xs">
                      <span className={`flex items-center gap-2 ${completed ? "text-brand-ink" : "text-brand-muted"}`}>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            completed ? "bg-emerald-100 text-emerald-600" : "bg-brand-surface text-brand-muted"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {m.title}
                      </span>
                      <span className="shrink-0 text-brand-muted">{m.duration}</span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/dashboard/courses/${continueCourse.enrollment.course.slug}`}
                className="rounded-full bg-brand-pink px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-pink-dark"
              >
                Attend Course
              </Link>
              <Link
                href={`/courses/${continueCourse.enrollment.course.slug}`}
                className="rounded-full border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-brand-ink hover:bg-brand-surface"
              >
                Course Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
