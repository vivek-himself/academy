import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.growthPage.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  // Prisma treats `undefined` as "leave unchanged" but `null` as "clear it" — only touch
  // nullable fields the caller actually sent, so a partial PATCH can't wipe the rest.
  const data: Record<string, unknown> = {
    title: body.title,
    titleHighlight: body.titleHighlight,
    subtitle: body.subtitle,
    checklistJson: body.checklistJson,
    ctaLabel: body.ctaLabel,
    expectParagraph: body.expectParagraph,
    dayTabsJson: body.dayTabsJson,
    quickFactsJson: body.quickFactsJson,
    benefitsTitle: body.benefitsTitle,
    benefitsJson: body.benefitsJson,
    benefitsCta: body.benefitsCta,
  };
  for (const key of [
    "eyebrow",
    "heroImageDesktopUrl",
    "heroImageMobileUrl",
    "expectImageDesktopUrl",
    "expectImageMobileUrl",
    "seoTitle",
    "seoDescription",
  ]) {
    if (key in body) data[key] = body[key] || null;
  }

  const page = await prisma.growthPage.update({ where: { slug }, data });

  return NextResponse.json(page);
}
