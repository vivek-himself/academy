import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";

export default async function BlogSidebar() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    for (const tag of safeJsonParse<string[]>(post.tagsJson, [])) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const recentPosts = posts.slice(0, 3);
  const categories = Array.from(categoryCounts.entries());
  const tags = Array.from(tagCounts.keys());

  return (
    <aside className="space-y-8">
      {categories.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Category</h3>
          <ul className="space-y-3">
            {categories.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between text-sm text-brand-muted">
                <span>{name}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentPosts.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Recent Posts</h3>
          <ul className="space-y-4">
            {recentPosts.map((p, i) => (
              <li key={p.id}>
                <Link href={`/knowledgebase/${p.slug}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.imageDesktopUrl ?? ""} alt={p.title} fill className="object-cover" />
                  </div>
                  <p className={`line-clamp-2 text-xs font-medium leading-snug ${i === 1 ? "text-brand-pink" : "text-brand-ink"}`}>
                    {p.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  tag === "Academy" ? "bg-brand-purple text-white" : "border border-brand-border text-brand-ink"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
