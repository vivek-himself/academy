import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../components/PageHeader";
import BatchesTable from "./BatchesTable";

export const dynamic = "force-dynamic";

export default async function BatchesPage() {
  const batches = await prisma.batch.findMany({
    include: { _count: { select: { students: true } }, course: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const data = batches.map((b) => ({
    id: b.id,
    name: b.name,
    classTimings: b.classTimings,
    capacity: b.capacity,
    startDate: b.startDate ? b.startDate.toISOString() : null,
    endDate: b.endDate ? b.endDate.toISOString() : null,
    enrolledCount: b._count.students,
    course: b.course,
  }));

  return (
    <div>
      <PageHeader
        title="Batches & Classes"
        subtitle="Group students into cohorts with shared class timings"
        action={
          <Link
            href="/admin/batches/new"
            className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
          >
            <Plus size={15} /> Add Batch
          </Link>
        }
      />
      <BatchesTable batches={data} />
    </div>
  );
}
