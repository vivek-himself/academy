import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function PATCH(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  await prisma.directMessage.updateMany({
    where: { userId, sender: "student", readAt: null },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
