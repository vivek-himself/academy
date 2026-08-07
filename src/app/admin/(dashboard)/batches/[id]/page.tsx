import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
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
  const [batch, allStudents, courses] = await Promise.all([
    prisma.batch.findUnique({
      where: { id },
      include: { students: { select: { id: true, name: true, email: true, batchId: true }, orderBy: { name: "asc" } } },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true, batchId: true }, orderBy: { name: "asc" } }),
    prisma.course.findMany({ select: { id: true, title: true, modulesJson: true }, orderBy: { title: "asc" } }),
  ]);
  if (!batch) notFound();

  const courseOptions = courses.map((c) => ({ id: c.id, title: c.title, modules: safeJsonParse<{ title: string; duration: string }[]>(c.modulesJson, []) }));

  const initial: BatchFormValue = {
    id: batch.id,
    name: batch.name,
    classDays: safeJsonParse<string[]>(batch.classDaysJson, []),
    startTime: batch.startTime ?? "",
    endTime: batch.endTime ?? "",
    meetingUrl: batch.meetingUrl ?? "",
    completedChapters: batch.completedChapters,
    capacity: batch.capacity ?? 0,
    startDate: toDateInput(batch.startDate),
    endDate: toDateInput(batch.endDate),
    courseId: batch.courseId ?? "",
  };

  return (
    <div>
      <PageHeader title="Edit Batch" subtitle={batch.name} />
      <div className="flex flex-col gap-6">
        <BatchForm initial={initial} courses={courseOptions} />
        <BatchRoster batchId={batch.id} members={batch.students} allStudents={allStudents} />
      </div>
    </div>
  );
}
