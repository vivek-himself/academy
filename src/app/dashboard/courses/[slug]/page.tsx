import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Users, Layers, Clock, BarChart3, ArrowLeft } from "lucide-react";
import VideoPlayerMock from "@/components/courses/VideoPlayerMock";
import CourseTabs from "@/components/courses/CourseTabs";
import DashboardCourseSidebar from "@/components/dashboard/DashboardCourseSidebar";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import { mapCourse } from "@/lib/mappers";
import { safeJsonParse } from "@/lib/json";
import { getCompletedModules } from "@/lib/enrollment";
import { isProfileComplete } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function DashboardCourseWatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const { slug } = await params;
  const dbCourse = await prisma.course.findUnique({
    where: { slug },
    include: { category: true, mentor: true, reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!dbCourse) notFound();

  const [enrollment, user] = await Promise.all([
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.userId, courseId: dbCourse.id } } }),
    prisma.user.findUnique({ where: { id: session.userId } }),
  ]);
  if (!user) redirect("/login");

  if (!enrollment) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white px-6 py-14 text-center">
        <h2 className="text-lg font-bold text-brand-ink">You&apos;re not enrolled in {dbCourse.title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">
          Reach out and we&apos;ll get you enrolled, or check out the course details first.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/courses/${slug}`} className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark">
            Course Details
          </Link>
          <Link href="/contact" className="rounded-full border border-brand-border px-6 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-surface">
            Get in Touch
          </Link>
        </div>
      </div>
    );
  }

  if (!isProfileComplete(user)) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white px-6 py-14 text-center">
        <h2 className="text-lg font-bold text-brand-ink">Complete your profile to attend {dbCourse.title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">
          You&apos;re enrolled, but we need your phone number, gender, and date of birth before you can start this
          course.
        </p>
        <Link
          href="/dashboard/settings"
          className="mt-5 inline-block rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  await prisma.enrollment.update({ where: { id: enrollment.id }, data: { lastAccessedAt: new Date() } });

  const course = mapCourse(dbCourse);
  const modules = safeJsonParse<{ title: string; duration: string }[]>(dbCourse.modulesJson, []);
  const tools = safeJsonParse<{ name: string; plan: string }[]>(dbCourse.toolsJson, []);
  const reviews = dbCourse.reviews.map((r) => ({ name: r.name, rating: r.rating, date: r.date, text: r.text }));
  const includes = safeJsonParse<string[]>(dbCourse.includesJson, []);
  const keyPoints = safeJsonParse<string[]>(dbCourse.keyPointsJson, []);
  const advantages = safeJsonParse<string[]>(dbCourse.advantagesJson, []);
  const requirements = safeJsonParse<string[]>(dbCourse.requirementsJson, []);
  const completed = getCompletedModules(enrollment.completedModulesJson);

  return (
    <div>
      <Link href="/dashboard/my-courses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-ink">
        <ArrowLeft size={14} /> Back to My Courses
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <VideoPlayerMock title={course.title} image={course.image} />

          <div className="mt-6">
            <h2 className="text-xl font-bold text-brand-ink">{course.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Image src={course.mentorAvatar} alt={course.mentor} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm text-brand-ink">{course.mentor}</span>
              </div>
              <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-ink">
                ★ {course.rating} ({course.reviews} Reviews)
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-brand-border py-3 text-xs text-brand-muted">
              <span className="flex items-center gap-1.5">
                <Users size={14} /> {course.students} Student
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={14} /> {course.modules} Modules
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {course.duration}
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-semibold text-brand-ink">
                {course.level} <BarChart3 size={14} />
              </span>
            </div>
          </div>

          <div className="mt-6">
            <CourseTabs
              description={dbCourse.description}
              includes={includes}
              keyPoints={keyPoints}
              advantages={advantages}
              requirements={requirements}
              modules={modules}
              reviews={reviews}
              tools={tools}
            />
          </div>
        </div>

        <div>
          <div className="lg:sticky lg:top-24">
            <DashboardCourseSidebar course={course} courseId={dbCourse.id} modules={modules} initialCompleted={completed} />
          </div>
        </div>
      </div>
    </div>
  );
}
