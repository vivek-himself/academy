import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const { body } = await req.json();
  if (!body || !body.trim()) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  const message = await prisma.directMessage.create({
    data: { userId, sender: "admin", body },
  });
  return NextResponse.json(message);
}
