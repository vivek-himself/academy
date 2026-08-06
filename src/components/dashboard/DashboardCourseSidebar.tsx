"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { Course, CourseModule } from "@/lib/data";

function LeaveReviewModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch(`/api/dashboard/courses/${slug}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to submit review.");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-brand-ink">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
                className={`text-xl ${n <= rating ? "text-amber-400" : "text-brand-border"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            required
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you think of this course?"
            className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
          />
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-brand-pink px-4 py-2 text-xs font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardCourseSidebar({
  course,
  courseId,
  modules,
  initialCompleted,
}: {
  course: Course;
  courseId: string;
  modules: CourseModule[];
  initialCompleted: number[];
}) {
  const [completed, setCompleted] = useState<number[]>(initialCompleted);
  const [reviewOpen, setReviewOpen] = useState(false);
  const total = Math.max(modules.length, 1);
  const percent = Math.min(100, Math.round((completed.length / total) * 100));

  async function toggleModule(index: number) {
    const next = completed.includes(index) ? completed.filter((i) => i !== index) : [...completed, index];
    setCompleted(next);
    await fetch("/api/dashboard/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, completedModules: next }),
    });
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5">
      <h3 className="text-base font-bold text-brand-ink">{course.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <Image src={course.mentorAvatar} alt={course.mentor} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
        <span className="text-sm text-brand-muted">{course.mentor}</span>
        <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-ink">★ {course.rating}</span>
      </div>

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
          <div className="h-full rounded-full bg-brand-pink transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-brand-muted">
          <span>
            {completed.length}/{modules.length} Module
          </span>
          <span>{percent}%</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
        <span className="text-sm font-semibold text-brand-ink">{modules.length} Module</span>
        <span className="text-sm font-semibold text-brand-ink">
          {completed.length}/{modules.length} Done
        </span>
      </div>

      <ul className="mt-3 space-y-1 pl-0">
        {modules.map((m, i) => {
          const done = completed.includes(i);
          return (
            <li key={m.title}>
              <button
                type="button"
                onClick={() => toggleModule(i)}
                className="flex w-full items-center gap-3 py-2 text-left hover:bg-brand-surface"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    done ? "bg-emerald-500 text-white" : "bg-white text-brand-muted ring-1 ring-brand-border"
                  }`}
                >
                  {done ? <CheckCircle2 size={12} /> : i + 1}
                </span>
                <span className={`flex-1 text-sm ${done ? "text-brand-ink" : "text-brand-ink/80"}`}>{m.title}</span>
                <span className="text-xs text-brand-muted">{m.duration}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => setReviewOpen(true)}
        className="mt-5 w-full rounded-full bg-brand-pink py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
      >
        Leave a Review
      </button>

      {reviewOpen && <LeaveReviewModal slug={course.slug} onClose={() => setReviewOpen(false)} />}
    </div>
  );
}
