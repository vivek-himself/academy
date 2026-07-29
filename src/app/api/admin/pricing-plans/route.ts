import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(plans);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!Array.isArray(body.plans)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.pricingPlan.deleteMany({});
    for (let i = 0; i < body.plans.length; i++) {
      const p = body.plans[i];
      await tx.pricingPlan.create({
        data: {
          name: p.name,
          tagline: p.tagline || null,
          price: p.price,
          recommended: Boolean(p.recommended),
          featuresJson: p.featuresJson,
          order: i,
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
