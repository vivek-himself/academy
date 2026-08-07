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
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-ink">{b.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-surface"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(b)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
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
