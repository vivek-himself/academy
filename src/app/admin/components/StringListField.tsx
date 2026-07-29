"use client";

import { Plus, Trash2 } from "lucide-react";

export default function StringListField({
  label,
  description,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  description?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      {description && <p className="mb-2 text-xs text-brand-muted">{description}</p>}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-pink"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border text-red-500 hover:bg-red-50"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:underline"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}
