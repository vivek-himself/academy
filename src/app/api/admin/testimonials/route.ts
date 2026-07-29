import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(testimonials);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!Array.isArray(body.testimonials)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.testimonial.deleteMany({});
    for (let i = 0; i < body.testimonials.length; i++) {
      const t = body.testimonials[i];
      await tx.testimonial.create({
        data: { quote: t.quote, name: t.name, role: t.role, avatarUrl: t.avatarUrl || null, order: i },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
