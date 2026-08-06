"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/data";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 6;

export default function KnowledgebaseExplorer({ items }: { items: BlogPost[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = page > totalPages ? totalPages : page;
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
      <div>
        <div key={currentPage} className="page-slide-in grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {pageItems.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {items.length === 0 && <p className="py-16 text-center text-sm text-brand-muted">No posts published yet.</p>}
        <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
      </div>
      <BlogSidebar />
    </div>
  );
}
