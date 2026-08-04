import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import StudentsTable from "./StudentsTable";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const [students, courses] = await Promise.all([
    prisma.user.findMany({
      include: { enrollments: { include: { course: { select: { title: true, modulesCount: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  const data = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    createdAt: s.createdAt.toISOString(),
    enrollments: s.enrollments.map((e) => ({
      courseId: e.courseId,
      completedModulesJson: e.completedModulesJson,
      enrolledAt: e.enrolledAt.toISOString(),
      course: e.course,
    })),
  }));

  return (
    <div>
      <PageHeader
        title="Users & Students"
        subtitle="Registered learners, their enrollments, and progress. Enroll them into courses manually until checkout is live."
      />
      <StudentsTable students={data} courses={courses} />
    </div>
  );
}
