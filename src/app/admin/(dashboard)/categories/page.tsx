import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import CategoriesManager from "./CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Course Categories" subtitle="Manage the categories courses can be organized under" />
      <CategoriesManager categories={categories.map((c) => ({ id: c.id, name: c.name, courseCount: c._count.courses }))} />
    </div>
  );
}
