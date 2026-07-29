"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({
  items,
  defaultOpenIndex = 1,
  columns = true,
}: {
  items: { question: string; answer?: string | null }[];
  defaultOpenIndex?: number;
  columns?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className={columns ? "grid grid-cols-1 gap-4 lg:grid-cols-2" : "flex flex-col gap-4"}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-xl border px-5 py-4 transition-colors ${
              isOpen ? "border-brand-pink/30 bg-white" : "border-brand-border bg-white"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className={`text-sm font-semibold sm:text-base ${isOpen ? "text-brand-pink" : "text-brand-ink"}`}>
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-brand-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && item.answer && (
              <p className="mt-3 text-sm text-brand-muted">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
