"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Layers, BadgeCheck, ArrowUpDown, Trash2, UserPlus } from "lucide-react";
import { getProgress } from "@/lib/enrollment";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 10;
const STATUSES = ["Active", "Inactive", "Suspended"] as const;
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name A–Z" },
] as const;

type Enrollment = {
  courseId: string;
  completedModulesJson: string;
  enrolledAt: string;
  course: { title: string; modulesCount: number };
};
type BatchOption = { id: string; name: string };
type Student = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  batch: BatchOption | null;
  enrollments: Enrollment[];
};
type CourseOption = { id: string; title: string };

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-brand-surface text-brand-muted",
  Suspended: "bg-red-50 text-red-600",
};

function StudentRow({
  student,
  courses,
  batches,
}: {
  student: Student;
  courses: CourseOption[];
  batches: BatchOption[];
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [movingBatch, setMovingBatch] = useState(false);

  const enrolledIds = new Set(student.enrollments.map((e) => e.courseId));
  const availableCourses = courses.filter((c) => !enrolledIds.has(c.id));

  async function handleEnroll() {
    if (!selectedCourse) return;
    setEnrolling(true);
    await fetch(`/api/admin/students/${student.id}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selectedCourse }),
    });
    setEnrolling(false);
    setSelectedCourse("");
    router.refresh();
  }

  async function handleRemove(courseId: string) {
    await fetch(`/api/admin/students/${student.id}/enrollments/${courseId}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleMoveBatch(batchId: string) {
    setMovingBatch(true);
    await fetch(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId: batchId || null }),
    });
    setMovingBatch(false);
    router.refresh();
  }

  async function handleStatusChange(status: string) {
    await fetch(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link href={`/admin/students/${student.id}`} className="text-sm font-bold text-brand-ink hover:text-brand-pink">
            {student.name}
          </Link>
          <p className="text-xs text-brand-muted">{student.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[student.status] ?? STATUS_STYLES.Active}`}>
            {student.status}
          </span>
          <p className="text-xs text-brand-muted">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-border pt-4">
        <label className="text-xs font-semibold text-brand-ink">Batch</label>
        <select
          value={student.batch?.id ?? ""}
          onChange={(e) => handleMoveBatch(e.target.value)}
          disabled={movingBatch}
          className="rounded-lg border border-brand-border px-2.5 py-1.5 text-xs text-brand-ink outline-none focus:border-brand-pink disabled:opacity-60"
        >
          <option value="">Unassigned</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <label className="ml-4 text-xs font-semibold text-brand-ink">Status</label>
        <select
          value={student.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-brand-border px-2.5 py-1.5 text-xs text-brand-ink outline-none focus:border-brand-pink"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {student.enrollments.length === 0 ? (
          <p className="text-xs text-brand-muted">Not enrolled in any courses.</p>
        ) : (
          student.enrollments.map((e) => {
            const progress = getProgress(e.completedModulesJson, e.course.modulesCount);
            return (
              <div key={e.courseId} className="flex items-center justify-between gap-3 rounded-lg bg-brand-surface px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-brand-ink">{e.course.title}</p>
                  <div className="mt-1 h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-brand-border">
                    <div className="h-full rounded-full bg-brand-pink" style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-brand-muted">{progress.percent}%</span>
                <button
                  type="button"
                  onClick={() => handleRemove(e.courseId)}
                  aria-label="Unenroll"
                  className="shrink-0 text-brand-muted hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {availableCourses.length > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-brand-border pt-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 rounded-lg border border-brand-border px-2.5 py-1.5 text-xs text-brand-ink outline-none focus:border-brand-pink"
          >
            <option value="">Enroll in a course...</option>
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleEnroll}
            disabled={!selectedCourse || enrolling}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pink px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            <UserPlus size={13} /> Enroll
          </button>
        </div>
      )}
    </div>
  );
}

export default function StudentsTable({
  students,
  courses,
  batches,
}: {
  students: Student[];
  courses: CourseOption[];
  batches: BatchOption[];
}) {
  const [query, setQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = students.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
      if (batchFilter === "__unassigned__" && s.batch) return false;
      else if (batchFilter && batchFilter !== "__unassigned__" && s.batch?.id !== batchFilter) return false;
      if (courseFilter && !s.enrollments.some((e) => e.courseId === courseFilter)) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
    });

    return result;
  }, [students, query, batchFilter, courseFilter, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const filterKey = `${query}|${batchFilter}|${courseFilter}|${statusFilter}|${sort}`;
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

  if (students.length === 0) {
    return (
      <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
        No students have signed up yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search name or email..."
            className="w-full rounded-full border border-brand-border bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            label="Batch"
            icon={<Layers size={15} />}
            options={[{ value: "__unassigned__", label: "Unassigned" }, ...batches.map((b) => ({ value: b.id, label: b.name }))]}
            value={batchFilter}
            onChange={setBatchFilter}
          />
          <Dropdown
            label="Course"
            icon={<Layers size={15} />}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
            value={courseFilter}
            onChange={setCourseFilter}
          />
          <Dropdown
            label="Status"
            icon={<BadgeCheck size={15} />}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <Dropdown
            label="Sort by: Newest"
            icon={<ArrowUpDown size={15} />}
            options={SORTS.map((s) => ({ value: s.value, label: s.label }))}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {pageItems.map((s) => (
          <StudentRow key={s.id} student={s} courses={courses} batches={batches} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-brand-muted">No students match your search or filters.</p>
      )}
      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
