import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mentor = await prisma.mentor.findUnique({ where: { id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mentor);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const mentor = await prisma.mentor.update({
    where: { id },
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio,
      imageDesktopUrl: body.imageDesktopUrl || null,
      imageMobileUrl: body.imageMobileUrl || null,
      linkedinUrl: body.linkedinUrl || null,
      websiteUrl: body.websiteUrl || null,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(mentor);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const usedCount = await prisma.course.count({ where: { mentorId: id } });
  if (usedCount > 0) {
    return NextResponse.json(
      { error: `Can't delete — ${usedCount} course(s) are assigned to this mentor.` },
      { status: 400 }
    );
  }
  await prisma.mentor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
