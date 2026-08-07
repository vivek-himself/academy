import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

// General-purpose partial update for a student — used by both the batch roster picker
// and the student list's "move batch"/status controls, so batch/status writes have one
// canonical mutation instead of drifting between multiple routes.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if ("status" in body) data.status = body.status;
  if ("batchId" in body) data.batchId = body.batchId || null;

  const student = await prisma.user.update({ where: { id }, data });
  return NextResponse.json(student);
}
