import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { rating, text } = await req.json();
  if (!rating || rating < 1 || rating > 5 || !text || !text.trim()) {
    return NextResponse.json({ error: "A rating and review text are required." }, { status: 400 });
  }

  const [course, user] = await Promise.all([
    prisma.course.findUnique({ where: { slug } }),
    prisma.user.findUnique({ where: { id: session.userId } }),
  ]);
  if (!course || !user) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: course.id } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Enroll in this course before leaving a review." }, { status: 403 });
  }

  await prisma.courseReview.create({
    data: {
      courseId: course.id,
      name: user.name,
      rating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      text: text.trim(),
    },
  });

  const agg = await prisma.courseReview.aggregate({ where: { courseId: course.id }, _avg: { rating: true }, _count: true });
  await prisma.course.update({
    where: { id: course.id },
    data: { rating: agg._avg.rating ?? course.rating, reviewsCount: agg._count },
  });

  return NextResponse.json({ ok: true });
}
