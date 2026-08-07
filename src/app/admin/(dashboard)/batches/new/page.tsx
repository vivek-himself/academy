import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import BatchForm, { type BatchFormValue } from "../BatchForm";

const initial: BatchFormValue = {
  name: "",
  classDays: [],
  startTime: "",
  endTime: "",
  capacity: 0,
  startDate: "",
  endDate: "",
  courseId: "",
};

export const dynamic = "force-dynamic";

export default async function NewBatchPage() {
  const courses = await prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } });

  return (
    <div>
      <PageHeader title="Add Batch" subtitle="Create a new cohort/class" />
      <BatchForm initial={initial} courses={courses} />
    </div>
  );
}
