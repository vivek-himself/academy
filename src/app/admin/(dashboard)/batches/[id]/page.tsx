import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import BatchForm, { type BatchFormValue } from "../BatchForm";
import BatchRoster from "./BatchRoster";

export const dynamic = "force-dynamic";

function toDateInput(d: Date | null) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export default async function EditBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [batch, allStudents] = await Promise.all([
    prisma.batch.findUnique({
      where: { id },
      include: { students: { select: { id: true, name: true, email: true, batchId: true }, orderBy: { name: "asc" } } },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true, batchId: true }, orderBy: { name: "asc" } }),
  ]);
  if (!batch) notFound();

  const initial: BatchFormValue = {
    id: batch.id,
    name: batch.name,
    classTimings: batch.classTimings ?? "",
    capacity: batch.capacity ?? 0,
    startDate: toDateInput(batch.startDate),
    endDate: toDateInput(batch.endDate),
  };

  return (
    <div>
      <PageHeader title="Edit Batch" subtitle={batch.name} />
      <div className="flex flex-col gap-6">
        <BatchForm initial={initial} />
        <BatchRoster batchId={batch.id} members={batch.students} allStudents={allStudents} />
      </div>
    </div>
  );
}
