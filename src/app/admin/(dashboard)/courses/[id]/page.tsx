import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import CourseForm, { type CourseFormValue } from "../CourseForm";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course, categories, mentors] = await Promise.all([
    prisma.course.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.mentor.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) notFound();

  const initial: CourseFormValue = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    level: course.level,
    categoryId: course.categoryId ?? "",
    mentorId: course.mentorId ?? "",
    rating: course.rating,
    reviewsCount: course.reviewsCount,
    students: course.students,
    modulesCount: course.modulesCount,
    duration: course.duration,
    price: course.price,
    originalPrice: course.originalPrice,
    imageDesktopUrl: course.imageDesktopUrl ?? "",
    imageMobileUrl: course.imageMobileUrl ?? "",
    description: course.description,
    includesJson: course.includesJson,
    keyPointsJson: course.keyPointsJson,
    advantagesJson: course.advantagesJson,
    requirementsJson: course.requirementsJson,
    modulesJson: course.modulesJson,
    toolsJson: course.toolsJson,
    seoTitle: course.seoTitle ?? "",
    seoDescription: course.seoDescription ?? "",
    published: course.published,
  };

  return (
    <div>
      <PageHeader title="Edit Course" subtitle={course.title} />
      <CourseForm initial={initial} categories={categories} mentors={mentors} />
    </div>
  );
}
