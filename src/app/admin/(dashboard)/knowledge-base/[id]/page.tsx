import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../components/PageHeader";
import BlogPostForm, { type BlogPostFormValue } from "../BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const initial: BlogPostFormValue = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    author: post.author,
    date: post.date,
    imageDesktopUrl: post.imageDesktopUrl ?? "",
    imageMobileUrl: post.imageMobileUrl ?? "",
    tagsJson: post.tagsJson,
    category: post.category,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    published: post.published,
  };

  return (
    <div>
      <PageHeader title="Edit Post" subtitle={post.title} />
      <BlogPostForm initial={initial} />
    </div>
  );
}
