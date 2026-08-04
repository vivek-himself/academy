import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get("folderId");

  const where = folderId === "uncategorized" ? { folderId: null } : folderId ? { folderId } : {};

  const assets = await prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(assets);
}
