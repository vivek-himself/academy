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

  // Prisma treats `undefined` as "leave unchanged" but `null` as "clear it" — only touch
  // nullable fields the caller actually sent, so a partial PATCH can't wipe the rest.
  const data: Record<string, unknown> = { name: body.name, role: body.role, bio: body.bio };
  if ("order" in body) data.order = body.order ?? 0;
  for (const key of ["imageDesktopUrl", "imageMobileUrl", "linkedinUrl", "websiteUrl"]) {
    if (key in body) data[key] = body[key] || null;
  }

  const mentor = await prisma.mentor.update({ where: { id }, data });
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
