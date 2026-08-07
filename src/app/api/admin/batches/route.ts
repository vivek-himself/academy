import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { formatClassTimings } from "@/lib/batch";

export async function GET() {
  const batches = await prisma.batch.findMany({
    include: { _count: { select: { students: true } }, course: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(batches);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "Batch name is required." }, { status: 400 });
  }

  const classDays: string[] = Array.isArray(body.classDays) ? body.classDays : [];

  const batch = await prisma.batch.create({
    data: {
      name: body.name,
      classDaysJson: JSON.stringify(classDays),
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      meetingUrl: body.meetingUrl || null,
      classTimings: formatClassTimings(classDays, body.startTime, body.endTime),
      capacity: body.capacity || null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      courseId: body.courseId || null,
    },
  });
  return NextResponse.json(batch);
}
