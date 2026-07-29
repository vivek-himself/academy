"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type PostRow = { id: string; title: string; date: string; published: boolean };

export default function PostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white">
      {error && <p className="p-4 text-sm font-medium text-red-500">{error}</p>}
      <div className="divide-y divide-brand-border">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-brand-ink">{p.title}</p>
              <p className="text-xs text-brand-muted">{p.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  p.published ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <Link
                href={`/admin/knowledge-base/${p.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-surface"
              >
                <Pencil size={14} />
              </Link>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-muted">No posts yet.</p>}
      </div>
    </div>
  );
}
