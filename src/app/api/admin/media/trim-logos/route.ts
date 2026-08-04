import { NextResponse } from "next/server";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logos = await prisma.trustLogo.findMany({ where: { imageUrl: { not: null } } });
  const results: { name: string; before: string; after: string }[] = [];

  for (const logo of logos) {
    if (!logo.imageUrl) continue;
    try {
      const res = await fetch(logo.imageUrl);
      const buffer = Buffer.from(await res.arrayBuffer());

      const before = await sharp(buffer).metadata();
      const trimmed = await sharp(buffer).trim({ threshold: 10 }).png().toBuffer();
      const after = await sharp(trimmed).metadata();

      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        continue;
      }

      const filename = `uploads/${Date.now()}-trimmed-${logo.id}.png`;
      const blob = await put(filename, trimmed, { access: "public", contentType: "image/png" });

      await prisma.trustLogo.update({ where: { id: logo.id }, data: { imageUrl: blob.url } });

      results.push({
        name: logo.name,
        before: `${before.width}x${before.height}`,
        after: `${after.width}x${after.height}`,
      });
    } catch {
      // Skip any logo that fails to process (e.g. unreadable format) — leave it untouched.
    }
  }

  return NextResponse.json({ ok: true, trimmed: results });
}
