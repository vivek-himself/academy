"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import ConfirmModal, { type ConfirmModalState } from "../../components/ConfirmModal";

type Category = { id: string; name: string; courseCount: number };

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmModalState | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to add category.");
      return;
    }
    setName("");
    router.refresh();
  }

  function handleDelete(id: string, name: string) {
    setConfirmState({
      title: `Delete "${name}"?`,
      message: "This can't be undone.",
      confirmLabel: "Delete Category",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
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
    <div className="max-w-xl">
      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
          maxLength={40}
          className="w-full rounded-lg border border-brand-border px-3 py-3 text-[15px] outline-none focus:border-brand-pink sm:py-2.5 sm:text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-pink px-5 py-3 text-sm font-semibold text-white active:bg-brand-pink-dark disabled:opacity-60 sm:py-2.5"
        >
          <Plus size={15} /> Add
        </button>
      </form>
      {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

      <div className="rounded-2xl border border-brand-border bg-brand-card">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 border-b border-brand-border px-5 py-3 last:border-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-brand-ink">{c.name}</p>
              <p className="text-xs text-brand-muted">{c.courseCount} course(s)</p>
            </div>
            <button
              onClick={() => handleDelete(c.id, c.name)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-border text-red-500 active:bg-red-50 lg:h-8 lg:w-8"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="px-5 py-8 text-center text-sm text-brand-muted">No categories yet.</p>}
      </div>
      {confirmState && <ConfirmModal state={confirmState} onClose={() => setConfirmState(null)} />}
    </div>
  );
}
