"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";

type StudentOption = { id: string; name: string; email: string; batchId: string | null };

export default function BatchRoster({
  batchId,
  members,
  allStudents,
}: {
  batchId: string;
  members: StudentOption[];
  allStudents: StudentOption[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);

  const availableStudents = allStudents.filter((s) => s.batchId !== batchId);

  async function moveStudent(studentId: string, newBatchId: string | null) {
    setBusy(true);
    await fetch(`/api/admin/students/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId: newBatchId }),
    });
    setBusy(false);
    router.refresh();
  }

  async function handleAdd() {
    if (!selected) return;
    await moveStudent(selected, batchId);
    setSelected("");
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
      <h3 className="mb-4 text-sm font-bold text-brand-ink">Students in this batch ({members.length})</h3>

      <div className="flex flex-col gap-2">
        {members.length === 0 && <p className="text-xs text-brand-muted">No students assigned yet.</p>}
        {members.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-brand-surface px-3 py-2.5">
            <div className="min-w-0">
              <Link href={`/admin/students/${s.id}`} className="truncate text-sm font-semibold text-brand-ink hover:text-brand-pink">
                {s.name}
              </Link>
              <p className="truncate text-xs text-brand-muted">{s.email}</p>
            </div>
            <button
              type="button"
              onClick={() => moveStudent(s.id, null)}
              disabled={busy}
              aria-label="Remove from batch"
              className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-red-500 disabled:opacity-60"
            >
              <UserMinus size={13} /> Remove
            </button>
          </div>
        ))}
      </div>

      {availableStudents.length > 0 && (
        <div className="mt-4 flex items-center gap-2 border-t border-brand-border pt-4">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 rounded-lg border border-brand-border px-2.5 py-1.5 text-xs text-brand-ink outline-none focus:border-brand-pink"
          >
            <option value="">Add a student...</option>
            {availableStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selected || busy}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pink px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            <UserPlus size={13} /> Add
          </button>
        </div>
      )}
    </div>
  );
}
