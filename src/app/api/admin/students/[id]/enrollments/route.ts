import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required." }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: id, courseId } },
    update: {},
    create: { userId: id, courseId },
  });

  return NextResponse.json(enrollment);
}
