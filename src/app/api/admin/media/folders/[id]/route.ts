import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Folder name is required." }, { status: 400 });
  }

  const folder = await prisma.mediaFolder.update({ where: { id }, data: { name: name.trim() } });
  return NextResponse.json(folder);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  // Assets inside are not deleted — they're detached back to "Uncategorized" (folderId set null via onDelete: SetNull).
  await prisma.mediaFolder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
