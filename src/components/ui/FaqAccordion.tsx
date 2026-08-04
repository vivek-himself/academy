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

  const renderItem = (item: { question: string; answer?: string | null }, i: number) => {
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
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${i}`}
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
          <p id={`faq-answer-${i}`} className="mt-3 text-sm text-brand-muted">
            {item.answer}
          </p>
        )}
      </div>
    );
  };

  if (!columns) {
    return <div className="flex flex-col gap-4">{items.map(renderItem)}</div>;
  }

  // Rendered as two independent stacks (rather than one CSS grid) so opening
  // an item never stretches its row-mate in the other column.
  const left = items.filter((_, i) => i % 2 === 0).map((item, idx) => [item, idx * 2] as const);
  const right = items.filter((_, i) => i % 2 === 1).map((item, idx) => [item, idx * 2 + 1] as const);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">{left.map(([item, i]) => renderItem(item, i))}</div>
      <div className="flex flex-col gap-4">{right.map(([item, i]) => renderItem(item, i))}</div>
    </div>
  );
}
