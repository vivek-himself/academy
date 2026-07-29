import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const mentors = await prisma.mentor.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(mentors);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const mentor = await prisma.mentor.create({
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
