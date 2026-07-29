import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const courses = await prisma.course.findMany({
    include: { category: true, mentor: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const exists = await prisma.course.findUnique({ where: { slug: body.slug } });
  if (exists) {
    return NextResponse.json({ error: "A course with this slug already exists." }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      slug: body.slug,
      title: body.title,
      level: body.level,
      categoryId: body.categoryId || null,
      mentorId: body.mentorId || null,
      rating: body.rating,
      reviewsCount: body.reviewsCount,
      students: body.students,
      modulesCount: body.modulesCount,
      duration: body.duration,
      price: body.price,
      originalPrice: body.originalPrice || null,
      imageDesktopUrl: body.imageDesktopUrl || null,
      imageMobileUrl: body.imageMobileUrl || null,
      description: body.description,
      keyPointsJson: body.keyPointsJson,
      modulesJson: body.modulesJson,
      toolsJson: body.toolsJson,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      published: body.published,
    },
  });

  return NextResponse.json(course);
}
