"use client";

import { Plus, Trash2 } from "lucide-react";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "checkbox";
};

export default function RepeaterField({
  label,
  description,
  items,
  onChange,
  fields,
  emptyItem,
  addLabel = "Add item",
}: {
  label: string;
  description?: string;
  items: Record<string, string | boolean>[];
  onChange: (items: Record<string, string | boolean>[]) => void;
  fields: FieldDef[];
  emptyItem: Record<string, string | boolean>;
  addLabel?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      {description && <p className="mb-2 text-xs text-brand-muted">{description}</p>}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-brand-border p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-medium text-brand-muted">{f.label}</label>
                  {f.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(item[f.key])}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], [f.key]: e.target.checked };
                        onChange(next);
                      }}
                      className="h-4 w-4 accent-brand-pink"
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      value={String(item[f.key] ?? "")}
                      rows={2}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], [f.key]: e.target.value };
                        onChange(next);
                      }}
                      className="w-full rounded-lg border border-brand-border px-2.5 py-2.5 text-[15px] outline-none focus:border-brand-pink sm:py-1.5 sm:text-sm"
                    />
                  ) : (
                    <input
                      value={String(item[f.key] ?? "")}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], [f.key]: e.target.value };
                        onChange(next);
                      }}
                      className="w-full rounded-lg border border-brand-border px-2.5 py-2.5 text-[15px] outline-none focus:border-brand-pink sm:py-1.5 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem])}
        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:underline"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}
