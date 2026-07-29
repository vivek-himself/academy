import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Layers, Clock, BarChart3 } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import VideoPlayerMock from "@/components/courses/VideoPlayerMock";
import CourseTabs from "@/components/courses/CourseTabs";
import CourseSidebar from "@/components/courses/CourseSidebar";
import WebinarCard from "@/components/courses/WebinarCard";
import SubscribeBanner from "@/components/ui/SubscribeBanner";
import { prisma } from "@/lib/prisma";
import { mapCourse } from "@/lib/mappers";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbCourse = await prisma.course.findUnique({
    where: { slug },
    include: { category: true, mentor: true, reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!dbCourse) notFound();

  const course = mapCourse(dbCourse);
  const modules = safeJsonParse<{ title: string; duration: string }[]>(dbCourse.modulesJson, []);
  const tools = safeJsonParse<{ name: string; plan: string }[]>(dbCourse.toolsJson, []);
  const reviews = dbCourse.reviews.map((r) => ({ name: r.name, rating: r.rating, date: r.date, text: r.text }));
  const keyPoints = safeJsonParse<string[]>(dbCourse.keyPointsJson, []);

  return (
    <>
      <section className="container-page py-8">
        <p className="text-sm text-brand-muted">
          {course.category} / {course.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-ink sm:text-3xl">{course.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Link href="/mentors" className="text-sm font-semibold text-brand-pink">
            {course.mentor}
          </Link>
          <div className="flex items-center gap-1.5">
            <StarRating rating={course.rating} />
            <span className="text-sm text-brand-muted">({course.reviews.toLocaleString()} ratings)</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <VideoPlayerMock />

            <div className="mt-6">
              <h2 className="text-xl font-bold text-brand-ink">{course.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <Image src={course.mentorAvatar} alt={course.mentor} width={28} height={28} className="rounded-full" />
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
                keyPoints={keyPoints}
                modules={modules}
                reviews={reviews}
                tools={tools}
              />
            </div>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <CourseSidebar course={course} modules={modules} />
              <WebinarCard />
            </div>
          </div>
        </div>
      </section>

      <SubscribeBanner />
    </>
  );
}
