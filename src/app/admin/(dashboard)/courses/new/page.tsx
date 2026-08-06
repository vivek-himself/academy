import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import CourseForm, { type CourseFormValue } from "../CourseForm";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const [categories, mentors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.mentor.findMany({ orderBy: { name: "asc" } }),
  ]);

  const initial: CourseFormValue = {
    slug: "",
    title: "",
    level: "Beginner",
    categoryId: "",
    mentorId: "",
    rating: 4.5,
    reviewsCount: 0,
    students: 0,
    modulesCount: 5,
    duration: "1h 30m",
    price: 0,
    originalPrice: null,
    imageDesktopUrl: "",
    imageMobileUrl: "",
    description: "",
    includesJson: "[]",
    keyPointsJson: "[]",
    advantagesJson: "[]",
    requirementsJson: "[]",
    modulesJson: "[]",
    toolsJson: "[]",
    seoTitle: "",
    seoDescription: "",
    published: true,
  };

  return (
    <div>
      <PageHeader title="Create Course" subtitle="Add a new course to your catalog" />
      <CourseForm initial={initial} categories={categories} mentors={mentors} />
    </div>
  );
}
