import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";

export async function GET() {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  return NextResponse.json({ user });
}
