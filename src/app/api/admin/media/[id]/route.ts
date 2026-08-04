import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const data: { name?: string; altText?: string; folderId?: string | null } = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.altText === "string") data.altText = body.altText;
  if (body.folderId !== undefined) data.folderId = body.folderId || null;

  const asset = await prisma.mediaAsset.update({ where: { id }, data });
  return NextResponse.json(asset);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN && asset.url.includes("blob.vercel-storage.com")) {
    try {
      await del(asset.url);
    } catch {
      // Blob may already be gone — non-fatal, still remove the DB record.
    }
  }

  await prisma.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
