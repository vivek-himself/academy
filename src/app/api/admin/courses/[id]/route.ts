import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { reviews: true },
  });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.slug) {
    const clash = await prisma.course.findFirst({ where: { slug: body.slug, NOT: { id } } });
    if (clash) {
      return NextResponse.json({ error: "A course with this slug already exists." }, { status: 400 });
    }
  }

  // Prisma treats `undefined` fields as "leave unchanged" but treats `null` as "clear it" —
  // so nullable fields must only be included when the caller actually sent them, otherwise a
  // partial PATCH (e.g. updating just the price) would wipe out category/mentor/images/SEO.
  const data: Record<string, unknown> = {
    slug: body.slug,
    title: body.title,
    level: body.level,
    rating: body.rating,
    reviewsCount: body.reviewsCount,
    students: body.students,
    modulesCount: body.modulesCount,
    duration: body.duration,
    price: body.price,
    description: body.description,
    includesJson: body.includesJson,
    keyPointsJson: body.keyPointsJson,
    advantagesJson: body.advantagesJson,
    requirementsJson: body.requirementsJson,
    modulesJson: body.modulesJson,
    toolsJson: body.toolsJson,
    published: body.published,
  };
  for (const key of ["categoryId", "mentorId", "originalPrice", "imageDesktopUrl", "imageMobileUrl", "seoTitle", "seoDescription"]) {
    if (key in body) data[key] = body[key] || null;
  }

  const course = await prisma.course.update({ where: { id }, data });

  return NextResponse.json(course);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
