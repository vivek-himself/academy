"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Users } from "lucide-react";
import ConfirmModal, { type ConfirmModalState } from "../../components/ConfirmModal";

type BatchRow = {
  id: string;
  name: string;
  classTimings: string | null;
  capacity: number | null;
  startDate: string | null;
  endDate: string | null;
  enrolledCount: number;
  course: { id: string; title: string } | null;
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BatchesTable({ batches }: { batches: BatchRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmModalState | null>(null);

  function handleDelete(b: BatchRow) {
    setConfirmState({
      title: `Delete "${b.name}"?`,
      message:
        b.enrolledCount > 0
          ? `${b.enrolledCount} student(s) in this batch will be unassigned, not deleted. This can't be undone.`
          : "This can't be undone.",
      confirmLabel: "Delete Batch",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/batches/${b.id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to delete.");
          return;
        }
        router.refresh();
      },
    });
  }

  if (batches.length === 0) {
    return (
      <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
        No batches yet.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card">
      {error && <p className="p-4 text-sm font-medium text-red-500">{error}</p>}
      <div className="divide-y divide-brand-border">
        {batches.map((b) => {
          const start = formatDate(b.startDate);
          const end = formatDate(b.endDate);
          return (
            <div key={b.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-ink">{b.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
                  {b.course && <span className="rounded-full bg-brand-pink/10 px-2 py-0.5 font-semibold text-brand-pink">{b.course.title}</span>}
                  {b.classTimings && <span>{b.classTimings}</span>}
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {b.enrolledCount}
                    {b.capacity ? ` / ${b.capacity}` : ""} students
                  </span>
                  {(start || end) && (
                    <span>
                      {start ?? "—"} → {end ?? "—"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/batches/${b.id}`}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-brand-ink active:bg-brand-surface lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-brand-surface"
                >
                  <Pencil size={14} />
                  <span className="lg:hidden">Edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(b)}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-red-500 active:bg-red-50 lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  <span className="lg:hidden">Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {confirmState && <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />}
    </div>
  );
}
