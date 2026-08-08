"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal, { type ConfirmModalState } from "../../components/ConfirmModal";

type CourseRow = {
  id: string;
  title: string;
  level: string;
  price: number;
  students: number;
  published: boolean;
  category: { name: string } | null;
  mentor: { name: string } | null;
};

export default function CoursesTable({ courses }: { courses: CourseRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmModalState | null>(null);

  function handleDelete(id: string, title: string) {
    setConfirmState({
      title: `Delete "${title}"?`,
      message: "This can't be undone.",
      confirmLabel: "Delete Course",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to delete.");
          return;
        }
        router.refresh();
      },
    });
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-border bg-brand-card p-10 text-center text-sm text-brand-muted">
        No courses yet. Tap &ldquo;Create Course&rdquo; to add your first one.
      </div>
    );
  }

  return (
    <>
      {error && <p className="mb-3 text-sm font-medium text-red-500">{error}</p>}

      {/* Desktop: data table. */}
      <div className="hidden overflow-hidden rounded-2xl border border-brand-border bg-brand-card lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-muted">
              <th className="px-5 py-3 font-medium">Course</th>
              <th className="px-5 py-3 font-medium">Mentor</th>
              <th className="px-5 py-3 font-medium">Students</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-brand-border last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium text-brand-ink">{c.title}</p>
                  <p className="text-xs text-brand-muted">
                    {c.category?.name ?? "Uncategorized"} <span className="mx-1">•</span>
                    <span className="rounded bg-brand-surface px-1.5 py-0.5">{c.level}</span>
                  </p>
                </td>
                <td className="px-5 py-4 text-brand-muted">{c.mentor?.name ?? "—"}</td>
                <td className="px-5 py-4 text-brand-muted">{c.students}</td>
                <td className="px-5 py-4 text-brand-muted">${c.price.toFixed(2)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.published ? "bg-emerald-100 text-emerald-700" : "bg-brand-surface text-brand-muted"
                    }`}
                  >
                    {c.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-surface"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id, c.title)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: grouped card list. */}
      <div className="flex flex-col gap-3 lg:hidden">
        {courses.map((c) => (
          <div key={c.id} className="rounded-2xl border border-brand-border bg-brand-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-ink">{c.title}</p>
                <p className="mt-1 text-xs text-brand-muted">
                  {c.category?.name ?? "Uncategorized"} · {c.level}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  c.published ? "bg-emerald-100 text-emerald-700" : "bg-brand-surface text-brand-muted"
                }`}
              >
                {c.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
              <span>{c.mentor?.name ?? "—"}</span>
              <span>{c.students} students</span>
              <span>${c.price.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-brand-border pt-3">
              <Link
                href={`/admin/courses/${c.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border py-2.5 text-xs font-semibold text-brand-ink active:bg-brand-surface"
              >
                <Pencil size={13} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(c.id, c.title)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border py-2.5 text-xs font-semibold text-red-500 active:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmState && <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />}
    </>
  );
}
