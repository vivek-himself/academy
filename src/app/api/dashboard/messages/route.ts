import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await req.json();
  if (!body || !body.trim()) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  const message = await prisma.directMessage.create({
    data: { userId: session.userId, sender: "student", body },
  });
  return NextResponse.json(message);
}
