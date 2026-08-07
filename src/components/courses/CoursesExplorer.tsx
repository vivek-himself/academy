"use client";

import { useMemo, useState } from "react";
import { Search, BarChart3, Grid2x2, ArrowUpDown } from "lucide-react";
import type { Course } from "@/lib/data";
import CourseCard from "@/components/ui/CourseCard";
import Pagination from "@/components/ui/Pagination";
import Dropdown from "@/components/ui/Dropdown";

const PAGE_SIZE = 8;
const LEVELS = ["Beginner", "Intermediate", "Master"] as const;
const SORTS = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

export default function CoursesExplorer({ items }: { items: Course[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<string>("popular");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const filterKey = `${query}|${level}|${category}|${sort}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  let currentPage = page;
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    currentPage = 1;
    setPage(1);
  } else if (page > totalPages) {
    currentPage = totalPages;
    setPage(totalPages);
  }

  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

      <div key={currentPage} className="page-slide-in mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pageItems.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-brand-muted">No courses match your search or filters.</p>
      )}
      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
