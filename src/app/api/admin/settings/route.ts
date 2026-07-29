import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      siteName: body.siteName,
      tagline: body.tagline,
      promoBarText: body.promoBarText,
      defaultSeoTitle: body.defaultSeoTitle || null,
      defaultSeoDescription: body.defaultSeoDescription || null,
      socialLinksJson: body.socialLinksJson,
    },
    create: {
      id: "default",
      siteName: body.siteName,
      tagline: body.tagline,
      promoBarText: body.promoBarText,
      defaultSeoTitle: body.defaultSeoTitle || null,
      defaultSeoDescription: body.defaultSeoDescription || null,
      socialLinksJson: body.socialLinksJson,
    },
  });

  return NextResponse.json(settings);
}
