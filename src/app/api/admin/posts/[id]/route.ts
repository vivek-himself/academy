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

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      author: body.author,
      date: body.date,
      imageDesktopUrl: body.imageDesktopUrl || null,
      imageMobileUrl: body.imageMobileUrl || null,
      tagsJson: body.tagsJson,
      category: body.category,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      published: body.published,
    },
  });

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
