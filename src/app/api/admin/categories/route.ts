import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body.name.toLowerCase().trim().replace(/\s+/g, "-");

  const exists = await prisma.category.findFirst({ where: { OR: [{ name: body.name }, { slug }] } });
  if (exists) {
    return NextResponse.json({ error: "A category with this name already exists." }, { status: 400 });
  }

  const category = await prisma.category.create({ data: { name: body.name, slug } });
  return NextResponse.json(category);
}
