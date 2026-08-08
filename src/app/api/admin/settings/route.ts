import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const SITE_STATUSES = ["live", "offline", "password_protected"];

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

  const data: Record<string, unknown> = {
    siteName: body.siteName,
    tagline: body.tagline,
    promoBarText: body.promoBarText,
    defaultSeoTitle: body.defaultSeoTitle || null,
    defaultSeoDescription: body.defaultSeoDescription || null,
    socialLinksJson: body.socialLinksJson,
  };

  if ("siteStatus" in body) {
    if (!SITE_STATUSES.includes(body.siteStatus)) {
      return NextResponse.json({ error: "Invalid site status." }, { status: 400 });
    }
    if (body.siteStatus === "password_protected") {
      const existing = await prisma.siteSettings.findUnique({ where: { id: "default" }, select: { sitePasswordHash: true } });
      if (!body.sitePassword && !existing?.sitePasswordHash) {
        return NextResponse.json({ error: "Set a site password before enabling password protection." }, { status: 400 });
      }
    }
    data.siteStatus = body.siteStatus;
  }

  if (body.sitePassword) {
    data.sitePasswordHash = await bcrypt.hash(body.sitePassword, 10);
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json(settings);
}
