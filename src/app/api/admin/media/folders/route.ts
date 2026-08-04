import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const folders = await prisma.mediaFolder.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { assets: true } } },
  });
  return NextResponse.json(folders);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Folder name is required." }, { status: 400 });
  }

  const folder = await prisma.mediaFolder.create({ data: { name: name.trim() } });
  return NextResponse.json(folder);
}
