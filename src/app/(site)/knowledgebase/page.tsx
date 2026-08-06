import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { mapBlogPost } from "@/lib/mappers";
import KnowledgebaseExplorer from "@/components/blog/KnowledgebaseExplorer";

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
      <KnowledgebaseExplorer items={items} />
    </section>
  );
}
