import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; courseId: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, courseId } = await params;
  await prisma.enrollment.delete({ where: { userId_courseId: { userId: id, courseId } } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
