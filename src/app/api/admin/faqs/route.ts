import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!Array.isArray(body.faqs)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.faq.deleteMany({});
    for (let i = 0; i < body.faqs.length; i++) {
      const f = body.faqs[i];
      await tx.faq.create({ data: { question: f.question, answer: f.answer || null, page: "global", order: i } });
    }
  });

  return NextResponse.json({ ok: true });
}
