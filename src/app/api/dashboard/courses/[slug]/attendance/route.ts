import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";
import { checkScheduleEligibility, dateOnly } from "@/lib/attendance";
import { safeJsonParse } from "@/lib/json";

const REASON_MESSAGES: Record<string, string> = {
  no_schedule: "Your batch doesn't have a class schedule set up yet.",
  wrong_day: "Today isn't one of your batch's scheduled class days.",
  outside_hours: "It's outside your batch's scheduled class time right now.",
};

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const [course, user] = await Promise.all([
    prisma.course.findUnique({ where: { slug } }),
    prisma.user.findUnique({ where: { id: session.userId }, include: { batch: true } }),
  ]);
  if (!course || !user) {
    return NextResponse.json({ error: "not_found", message: "Not found." }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: course.id } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "not_enrolled", message: "You're not enrolled in this course." }, { status: 403 });
  }

  const batch = user.batch && user.batch.courseId === course.id ? user.batch : null;
  if (!batch) {
    return NextResponse.json(
      { error: "no_batch", message: "You're not assigned to a batch for this course, so attendance can't be tracked yet." },
      { status: 400 }
    );
  }

  const classDays = safeJsonParse<string[]>(batch.classDaysJson, []);
  const check = checkScheduleEligibility(classDays, batch.startTime, batch.endTime, new Date());
  if (!check.eligible) {
    return NextResponse.json(
      {
        error: check.reason,
        message: REASON_MESSAGES[check.reason],
        schedule: { classDays, startTime: batch.startTime, endTime: batch.endTime },
      },
      { status: 400 }
    );
  }

  const today = dateOnly(new Date());
  await prisma.attendance.upsert({
    where: { userId_courseId_date: { userId: session.userId, courseId: course.id, date: today } },
    update: {},
    create: { userId: session.userId, courseId: course.id, date: today },
  });

  return NextResponse.json({ ok: true });
}
