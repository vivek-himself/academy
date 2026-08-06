import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.slug) {
    const clash = await prisma.blogPost.findFirst({ where: { slug: body.slug, NOT: { id } } });
    if (clash) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 400 });
    }
  }

  // Prisma treats `undefined` as "leave unchanged" but `null` as "clear it" — only touch
  // nullable fields the caller actually sent, so a partial PATCH can't wipe the rest.
  const data: Record<string, unknown> = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    body: body.body,
    author: body.author,
    date: body.date,
    tagsJson: body.tagsJson,
    category: body.category,
    published: body.published,
  };
  for (const key of ["imageDesktopUrl", "imageMobileUrl", "seoTitle", "seoDescription"]) {
    if (key in body) data[key] = body[key] || null;
  }

  const post = await prisma.blogPost.update({ where: { id }, data });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
