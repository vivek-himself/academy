import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const recipient = await prisma.notificationRecipient.findUnique({ where: { id } });
  if (!recipient || recipient.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.notificationRecipient.update({ where: { id }, data: { readAt: new Date() } });
  return NextResponse.json({ ok: true });
}
