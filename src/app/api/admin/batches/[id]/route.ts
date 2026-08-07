import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { formatClassTimings } from "@/lib/batch";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      students: { select: { id: true, name: true, email: true, status: true } },
      course: { select: { id: true, title: true } },
    },
  });
  if (!batch) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(batch);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if ("name" in body) data.name = body.name;
  if ("capacity" in body) data.capacity = body.capacity || null;
  if ("startDate" in body) data.startDate = body.startDate ? new Date(body.startDate) : null;
  if ("endDate" in body) data.endDate = body.endDate ? new Date(body.endDate) : null;
  if ("courseId" in body) data.courseId = body.courseId || null;
  if ("meetingUrl" in body) data.meetingUrl = body.meetingUrl || null;

  if ("classDays" in body || "startTime" in body || "endTime" in body) {
    const classDays: string[] = Array.isArray(body.classDays) ? body.classDays : [];
    data.classDaysJson = JSON.stringify(classDays);
    data.startTime = body.startTime || null;
    data.endTime = body.endTime || null;
    data.classTimings = formatClassTimings(classDays, body.startTime, body.endTime);
  }

  const batch = await prisma.batch.update({ where: { id }, data });
  return NextResponse.json(batch);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  // onDelete: SetNull on User.batchId unassigns students automatically — no manual cleanup needed.
  await prisma.batch.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
