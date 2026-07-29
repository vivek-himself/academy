import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const exists = await prisma.blogPost.findUnique({ where: { slug: body.slug } });
  if (exists) {
    return NextResponse.json({ error: "A post with this slug already exists." }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
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
