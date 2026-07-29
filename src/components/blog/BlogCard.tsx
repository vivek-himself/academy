import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/data";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/knowledgebase/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug text-brand-ink group-hover:text-brand-pink">
        {post.title}
      </h3>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-muted">
        <Calendar size={13} /> {post.date}
      </p>
      <p className="mt-2 text-sm text-brand-muted">{post.excerpt}</p>
    </Link>
  );
}
