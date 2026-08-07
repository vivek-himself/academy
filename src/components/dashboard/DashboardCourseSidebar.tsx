"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, CalendarClock, CheckCheck, Video } from "lucide-react";
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

type AttendanceSchedule = {
  classDays: string[];
  startTime: string | null;
  endTime: string | null;
  meetingUrl: string | null;
} | null;

function AttendanceModal({ message, schedule, onClose }: { message: string; schedule: AttendanceSchedule; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <CalendarClock size={18} />
        </div>
        <h3 className="mt-3 text-sm font-bold text-brand-ink">Can&apos;t mark attendance right now</h3>
        <p className="mt-1.5 text-sm text-brand-muted">{message}</p>
        {schedule && schedule.classDays.length > 0 && schedule.startTime && schedule.endTime && (
          <div className="mt-3 rounded-lg bg-brand-surface px-3 py-2.5 text-xs text-brand-ink">
            <p className="font-semibold">Your batch&apos;s class schedule</p>
            <p className="mt-1 text-brand-muted">
              {schedule.classDays.join(", ")} · {schedule.startTime} – {schedule.endTime}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-brand-pink py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function DashboardCourseSidebar({
  course,
  courseId,
  modules,
  initialCompleted,
  attendanceSchedule,
  alreadyMarkedToday,
}: {
  course: Course;
  courseId: string;
  modules: CourseModule[];
  initialCompleted: number[];
  attendanceSchedule: AttendanceSchedule;
  alreadyMarkedToday: boolean;
}) {
  const [completed, setCompleted] = useState<number[]>(initialCompleted);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [marked, setMarked] = useState(alreadyMarkedToday);
  const [marking, setMarking] = useState(false);
  const [attendanceNotice, setAttendanceNotice] = useState<{ message: string; schedule: AttendanceSchedule } | null>(null);
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

  async function handleMarkAttendance() {
    setMarking(true);
    const res = await fetch(`/api/dashboard/courses/${course.slug}/attendance`, { method: "POST" });
    const data = await res.json();
    setMarking(false);
    if (!res.ok) {
      setAttendanceNotice({ message: data.message ?? "Attendance isn't available right now.", schedule: data.schedule ?? null });
      return;
    }
    setMarked(true);
    if (attendanceSchedule?.meetingUrl) {
      window.open(attendanceSchedule.meetingUrl, "_blank", "noopener,noreferrer");
    }
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

      {attendanceSchedule && (
        <p className="mt-3 text-xs text-brand-muted">Progress is tracked by your instructor for this batch.</p>
      )}

      <ul className="mt-3 space-y-1 pl-0">
        {modules.map((m, i) => {
          const done = completed.includes(i);
          const content = (
            <>
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                  done ? "bg-emerald-500 text-white" : "bg-white text-brand-muted ring-1 ring-brand-border"
                }`}
              >
                {done ? <CheckCircle2 size={12} /> : i + 1}
              </span>
              <span className={`flex-1 text-sm ${done ? "text-brand-ink" : "text-brand-ink/80"}`}>{m.title}</span>
              <span className="text-xs text-brand-muted">{m.duration}</span>
            </>
          );
          return (
            <li key={m.title}>
              {attendanceSchedule ? (
                <div className="flex w-full items-center gap-3 py-2">{content}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleModule(i)}
                  className="flex w-full items-center gap-3 py-2 text-left hover:bg-brand-surface"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {attendanceSchedule && (
        <>
          <button
            type="button"
            onClick={handleMarkAttendance}
            disabled={marked || marking}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold ${
              marked
                ? "bg-emerald-50 text-emerald-600"
                : "border border-brand-border text-brand-ink hover:bg-brand-surface disabled:opacity-60"
            }`}
          >
            {marked ? (
              <>
                <CheckCheck size={15} /> Attendance Marked Today
              </>
            ) : (
              <>
                <CalendarClock size={15} /> {marking ? "Marking..." : "Mark Attendance"}
              </>
            )}
          </button>
          {!marked && attendanceSchedule.classDays.length > 0 && attendanceSchedule.startTime && attendanceSchedule.endTime && (
            <p className="mt-1.5 text-center text-[11px] text-brand-muted">
              Class days: {attendanceSchedule.classDays.join(", ")} · {attendanceSchedule.startTime}–{attendanceSchedule.endTime}
            </p>
          )}
          {marked && attendanceSchedule.meetingUrl && (
            <a
              href={attendanceSchedule.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple py-3 text-sm font-semibold text-white hover:bg-brand-purple-dark"
            >
              <Video size={15} /> Join Class
            </a>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => setReviewOpen(true)}
        className="mt-2.5 w-full rounded-full bg-brand-pink py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark"
      >
        Leave a Review
      </button>

      {reviewOpen && <LeaveReviewModal slug={course.slug} onClose={() => setReviewOpen(false)} />}
      {attendanceNotice && (
        <AttendanceModal
          message={attendanceNotice.message}
          schedule={attendanceNotice.schedule}
          onClose={() => setAttendanceNotice(null)}
        />
      )}
    </div>
  );
}
