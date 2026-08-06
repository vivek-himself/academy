import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WebP, or GIF." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Max size is 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `avatar-${session.userId}-${Date.now()}${ext}`;

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`student-uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    url = blob.url;
  } else {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { avatarUrl: url },
  });

  return NextResponse.json({ url });
}
