"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type MentorRow = {
  id: string;
  name: string;
  role: string;
  imageDesktopUrl: string | null;
};

export default function MentorsTable({ mentors }: { mentors: MentorRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/admin/mentors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card">
      {error && <p className="p-4 text-sm font-medium text-red-500">{error}</p>}
      <div className="divide-y divide-brand-border">
        {mentors.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {m.imageDesktopUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={m.imageDesktopUrl} alt={m.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface text-xs text-brand-muted">
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-surface"
              >
                <Pencil size={14} />
              </Link>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {mentors.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-muted">No mentors yet.</p>}
      </div>
    </div>
  );
}
