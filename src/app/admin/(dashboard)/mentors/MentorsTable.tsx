"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal, { type ConfirmModalState } from "../../components/ConfirmModal";

type MentorRow = {
  id: string;
  name: string;
  role: string;
  imageDesktopUrl: string | null;
};

export default function MentorsTable({ mentors }: { mentors: MentorRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmModalState | null>(null);

  function handleDelete(id: string, name: string) {
    setConfirmState({
      title: `Delete "${name}"?`,
      message: "This can't be undone.",
      confirmLabel: "Delete Mentor",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/mentors/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to delete.");
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
        {mentors.map((m) => (
          <div key={m.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {m.imageDesktopUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={m.imageDesktopUrl} alt={m.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-surface text-xs text-brand-muted">
                  {m.name.charAt(0)}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-brand-ink">{m.name}</p>
                <p className="text-xs text-brand-muted">{m.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/mentors/${m.id}`}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-brand-ink active:bg-brand-surface lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-brand-surface"
              >
                <Pencil size={14} />
                <span className="lg:hidden">Edit</span>
              </Link>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-border text-sm font-semibold text-red-500 active:bg-red-50 lg:h-8 lg:w-8 lg:flex-none lg:text-xs lg:font-normal lg:hover:bg-red-50"
              >
                <Trash2 size={14} />
                <span className="lg:hidden">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {mentors.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-muted">No mentors yet.</p>}
      </div>
      {confirmState && <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />}
    </div>
  );
}
