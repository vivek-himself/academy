import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import BlogSidebar from "@/components/blog/BlogSidebar";
import CTABanner from "@/components/ui/CTABanner";
import { FacebookIcon, PinterestIcon, XIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/json";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug } }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, select: { slug: true, title: true } }),
  ]);
  if (!post) notFound();

  const tags = safeJsonParse<string[]>(post.tagsJson, []);
  const index = allPosts.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? allPosts[index - 1] : allPosts[allPosts.length - 1];
  const next = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : allPosts[0];

  return (
    <>
      <section className="container-page py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <h1 className="text-2xl font-bold leading-snug text-brand-ink sm:text-3xl">{post.title}</h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-brand-muted">
              <span className="flex items-center gap-1.5">
                <User size={14} /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {post.date}
              </span>
            </div>

            {post.imageDesktopUrl && (
              <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <Image src={post.imageDesktopUrl} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div className="mt-6 space-y-4 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
              <p>{post.body}</p>
            </div>

            {tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-brand-ink">Tags:</span>
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
            )}

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-brand-ink">Share:</span>
              {[FacebookIcon, PinterestIcon, XIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {(prev || next) && (
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-brand-border pt-8 sm:grid-cols-2">
                {prev && (
                  <Link
                    href={`/knowledgebase/${prev.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-brand-border p-4 hover:border-brand-pink/40"
                  >
                    <ChevronLeft size={18} className="shrink-0 text-brand-muted" />
                    <div>
                      <p className="text-xs text-brand-muted">Prev Article</p>
                      <p className="text-sm font-semibold text-brand-ink">{prev.title}</p>
                    </div>
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/knowledgebase/${next.slug}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-brand-border p-4 text-right hover:border-brand-pink/40"
                  >
                    <div>
                      <p className="text-xs text-brand-muted">Next Article</p>
                      <p className="text-sm font-semibold text-brand-ink">{next.title}</p>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-brand-muted" />
                  </Link>
                )}
              </div>
            )}
          </div>
          <BlogSidebar />
        </div>
      </section>
      <CTABanner />
    </>
  );
}
