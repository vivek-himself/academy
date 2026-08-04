import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { imageSize } from "image-size";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folderId = (formData.get("folderId") as string | null) || null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Max size is 8MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production (and any environment with Vercel Blob configured): persistent cloud storage.
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    url = blob.url;
  } else {
    // Local fallback so uploads still work before Blob storage is connected.
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  let width: number | undefined;
  let height: number | undefined;
  try {
    const dims = imageSize(buffer);
    width = dims.width;
    height = dims.height;
  } catch {
    // SVGs or unusual files may fail dimension detection — non-fatal.
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      url,
      width,
      height,
      format: file.type,
      sizeBytes: file.size,
      folderId,
    },
  });

  return NextResponse.json({ url: asset.url, width: asset.width, height: asset.height, id: asset.id });
}
