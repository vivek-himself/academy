import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const links = await prisma.footerLink.findMany({ orderBy: [{ column: "asc" }, { order: "asc" }] });
  return NextResponse.json(links);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!Array.isArray(body.links)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.footerLink.deleteMany({});
    const byColumn: Record<string, number> = {};
    for (const l of body.links) {
      const order = byColumn[l.column] ?? 0;
      byColumn[l.column] = order + 1;
      await tx.footerLink.create({ data: { column: l.column, label: l.label, href: l.href, order } });
    }
  });

  return NextResponse.json({ ok: true });
}
