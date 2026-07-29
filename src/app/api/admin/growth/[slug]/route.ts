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

  const page = await prisma.growthPage.update({
    where: { slug },
    data: {
      eyebrow: body.eyebrow || null,
      title: body.title,
      titleHighlight: body.titleHighlight,
      subtitle: body.subtitle,
      checklistJson: body.checklistJson,
      ctaLabel: body.ctaLabel,
      heroImageDesktopUrl: body.heroImageDesktopUrl || null,
      heroImageMobileUrl: body.heroImageMobileUrl || null,
      expectParagraph: body.expectParagraph,
      dayTabsJson: body.dayTabsJson,
      expectImageDesktopUrl: body.expectImageDesktopUrl || null,
      expectImageMobileUrl: body.expectImageMobileUrl || null,
      quickFactsJson: body.quickFactsJson,
      benefitsTitle: body.benefitsTitle,
      benefitsJson: body.benefitsJson,
      benefitsCta: body.benefitsCta,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    },
  });

  return NextResponse.json(page);
}
