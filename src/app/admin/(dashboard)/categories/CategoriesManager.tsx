"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Category = { id: string; name: string; courseCount: number };

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleAdd} className="mb-6 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
          maxLength={40}
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          <Plus size={15} /> Add
        </button>
      </form>
      {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

      <div className="rounded-2xl border border-brand-border bg-white">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between border-b border-brand-border px-5 py-3 last:border-0">
            <div>
              <p className="text-sm font-medium text-brand-ink">{c.name}</p>
              <p className="text-xs text-brand-muted">{c.courseCount} course(s)</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="px-5 py-8 text-center text-sm text-brand-muted">No categories yet.</p>}
      </div>
    </div>
  );
}
