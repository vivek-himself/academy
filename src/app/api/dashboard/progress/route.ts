import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

export async function PATCH(req: NextRequest) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, completedModules } = await req.json();
  if (!courseId || !Array.isArray(completedModules)) {
    return NextResponse.json({ error: "courseId and completedModules are required." }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this course." }, { status: 404 });
  }

  const updated = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { completedModulesJson: JSON.stringify(completedModules), lastAccessedAt: new Date() },
  });

  return NextResponse.json({ ok: true, completedModulesJson: updated.completedModulesJson });
}
