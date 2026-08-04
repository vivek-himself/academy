import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import { mapBlogPost } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledgebase",
};

export default async function KnowledgebasePage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const items = posts.map(mapBlogPost);

  return (
    <section className="container-page py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold text-brand-ink sm:text-3xl">Knowledgebase</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {items.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          {items.length === 0 && <p className="py-16 text-center text-sm text-brand-muted">No posts published yet.</p>}
          <Pagination total={3} />
        </div>
        <BlogSidebar />
      </div>
    </section>
  );
}
