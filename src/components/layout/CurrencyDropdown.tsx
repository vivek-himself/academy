"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/components/providers/CurrencyProvider";

export default function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select currency"
        className="flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3 py-1.5 text-sm font-semibold text-brand-pink hover:border-brand-pink/40"
      >
        <Globe size={15} />
        {currency}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-40 overflow-hidden rounded-xl border border-brand-border bg-white py-1.5 shadow-xl">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium ${
                currency === c.code ? "bg-brand-pink/10 text-brand-pink" : "text-brand-ink hover:bg-brand-surface"
              }`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              {c.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
