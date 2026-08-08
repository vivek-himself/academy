"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal, { type ConfirmModalState } from "../../components/ConfirmModal";

type PostRow = { id: string; title: string; date: string; published: boolean };

export default function PostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmModalState | null>(null);

  function handleDelete(id: string, title: string) {
    setConfirmState({
      title: `Delete "${title}"?`,
      message: "This can't be undone.",
      confirmLabel: "Delete Post",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
        if (!res.ok) {
          setError("Failed to delete.");
          return;
        }
        router.refresh();
      },
    });
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card">
      {error && <p className="p-4 text-sm font-medium text-red-500">{error}</p>}
      <div className="divide-y divide-brand-border">
        {posts.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  p.published ? "bg-emerald-100 text-emerald-700" : "bg-brand-surface text-brand-muted"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-brand-ink">{p.title}</p>
                <p className="text-xs text-brand-muted">{p.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/knowledge-base/${p.id}`}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-brand-ink active:bg-brand-surface lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-brand-surface"
              >
                <Pencil size={14} />
                <span className="lg:hidden">Edit</span>
              </Link>
              <button
                onClick={() => handleDelete(p.id, p.title)}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-red-500 active:bg-red-50 lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-red-50"
              >
                <Trash2 size={14} />
                <span className="lg:hidden">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-muted">No posts yet.</p>}
      </div>
      {confirmState && <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />}
    </div>
  );
}
