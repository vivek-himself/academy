"use client";

import { useMemo, useState } from "react";
import { Search, BarChart3, Grid2x2, ArrowUpDown, Check } from "lucide-react";
import type { Course } from "@/lib/data";
import CourseCard from "@/components/ui/CourseCard";

const LEVELS = ["Beginner", "Intermediate", "Master"] as const;
const SORTS = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

function Dropdown({
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

export default function CoursesExplorer({ items }: { items: Course[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<string>("popular");

  const categories = useMemo(() => Array.from(new Set(items.map((c) => c.category))).sort(), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = items.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.mentor.toLowerCase().includes(q)) return false;
      if (level && c.level !== level) return false;
      if (category && c.category !== category) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.students - a.students; // popular
    });

    return result;
  }, [items, query, level, category, sort]);

  return (
    <>
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
          <Dropdown
            label="Level"
            icon={<BarChart3 size={15} />}
            options={LEVELS.map((l) => ({ value: l, label: l }))}
            value={level}
            onChange={setLevel}
          />
          <Dropdown
            label="Category"
            icon={<Grid2x2 size={15} />}
            options={categories.map((c) => ({ value: c, label: c }))}
            value={category}
            onChange={setCategory}
          />
          <Dropdown
            label="Sort by: Popular"
            icon={<ArrowUpDown size={15} />}
            options={SORTS.map((s) => ({ value: s.value, label: s.label }))}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-brand-muted">No courses match your search or filters.</p>
      )}
    </>
  );
}
