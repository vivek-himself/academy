"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function Dropdown({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium ${
          value ? "border-brand-pink/40 bg-brand-pink/5 text-brand-pink" : "border-brand-border bg-white text-brand-ink"
        }`}
      >
        {icon} {active ? active.label : label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-brand-border bg-white p-1.5 shadow-lg">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium text-brand-muted hover:bg-brand-surface"
              >
                Clear
              </button>
            )}
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-brand-ink hover:bg-brand-surface"
              >
                {o.label}
                {value === o.value && <Check size={14} className="text-brand-pink" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
