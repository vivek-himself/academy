import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const batches = await prisma.batch.findMany({
    include: { _count: { select: { students: true } } },
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

  const batch = await prisma.batch.create({
    data: {
      name: body.name,
      classTimings: body.classTimings || null,
      capacity: body.capacity || null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
  return NextResponse.json(batch);
}
