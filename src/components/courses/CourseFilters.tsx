"use client";

import { useState } from "react";
import { Search, BarChart3, Grid2x2, ArrowUpDown } from "lucide-react";

export default function CourseFilters() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-md">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search Course Name, Mentor...."
          className="w-full rounded-full border border-brand-border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-pink"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-ink">
          <BarChart3 size={15} /> Beginner
        </button>
        <button className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-ink">
          <Grid2x2 size={15} /> Category
        </button>
        <button className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-ink">
          <ArrowUpDown size={15} /> Sort by: Popular
        </button>
      </div>
    </div>
  );
}
