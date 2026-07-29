"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ total = 3 }: { total?: number }) {
  const [active, setActive] = useState(1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => setActive((p) => Math.max(1, p - 1))}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-muted hover:bg-white"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: total }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => setActive(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
              active === page ? "bg-brand-pink text-white" : "text-brand-ink hover:bg-white"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => setActive((p) => Math.min(total, p + 1))}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-muted hover:bg-white"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
