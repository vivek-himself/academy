import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const BLOCK_KEYS = [
  "home_tech_stack",
  "home_grow_skill",
  "home_random_promo",
  "cta_banner_default",
  "home_review_badges",
  "home_trending_courses",
] as const;

export async function GET() {
  const [heroSlides, stats, trustLogos, blocks] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
    prisma.homepageStat.findMany({ orderBy: { order: "asc" } }),
    prisma.trustLogo.findMany({ orderBy: { order: "asc" } }),
    prisma.contentBlock.findMany({ where: { key: { in: [...BLOCK_KEYS] } } }),
  ]);

  const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.dataJson]));

  return NextResponse.json({ heroSlides, stats, trustLogos, blocks: blockMap });
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await prisma.$transaction(async (tx) => {
    if (Array.isArray(body.heroSlides)) {
      await tx.heroSlide.deleteMany({});
      for (let i = 0; i < body.heroSlides.length; i++) {
        const s = body.heroSlides[i];
        await tx.heroSlide.create({
          data: {
            title: s.title,
            subtitle: s.subtitle,
            ctaLabel: s.ctaLabel,
            ctaHref: s.ctaHref,
            imageDesktopUrl: s.imageDesktopUrl || null,
            imageMobileUrl: s.imageMobileUrl || null,
            order: i,
          },
        });
      }
    }

    if (Array.isArray(body.stats)) {
      await tx.homepageStat.deleteMany({});
      for (let i = 0; i < body.stats.length; i++) {
        const s = body.stats[i];
        await tx.homepageStat.create({ data: { icon: s.icon, value: s.value, label: s.label, order: i } });
      }
    }

    if (Array.isArray(body.trustLogos)) {
      await tx.trustLogo.deleteMany({});
      for (let i = 0; i < body.trustLogos.length; i++) {
        const l = body.trustLogos[i];
        await tx.trustLogo.create({ data: { name: l.name, imageUrl: l.imageUrl || null, order: i } });
      }
    }

    if (body.blocks) {
      for (const key of BLOCK_KEYS) {
        if (body.blocks[key] !== undefined) {
          await tx.contentBlock.upsert({
            where: { key },
            update: { dataJson: body.blocks[key] },
            create: { key, dataJson: body.blocks[key] },
          });
        }
      }
    }
  });

  return NextResponse.json({ ok: true });
}
