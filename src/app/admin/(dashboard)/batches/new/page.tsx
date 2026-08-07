import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";
import PageHeader from "../../../components/PageHeader";
import BatchForm, { type BatchFormValue } from "../BatchForm";

const initial: BatchFormValue = {
  name: "",
  classDays: [],
  startTime: "",
  endTime: "",
  meetingUrl: "",
  completedChapters: 0,
  capacity: 0,
  startDate: "",
  endDate: "",
  courseId: "",
};

export const dynamic = "force-dynamic";

export default async function NewBatchPage() {
  const courseRows = await prisma.course.findMany({ select: { id: true, title: true, modulesJson: true }, orderBy: { title: "asc" } });
  const courses = courseRows.map((c) => ({ id: c.id, title: c.title, modules: safeJsonParse<{ title: string; duration: string }[]>(c.modulesJson, []) }));

  return (
    <div>
      <PageHeader title="Add Batch" subtitle="Create a new cohort/class" />
      <BatchForm initial={initial} courses={courses} />
    </div>
  );
}
