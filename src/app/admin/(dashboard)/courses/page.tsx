import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import CoursesTable from "./CoursesTable";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: { category: true, mentor: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Course Management"
        subtitle="Manage courses and their content"
        action={
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            <Plus size={15} /> Create Course
          </Link>
        }
      />
      <CoursesTable courses={courses} />
    </div>
  );
}
