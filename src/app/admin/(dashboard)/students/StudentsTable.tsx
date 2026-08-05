"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus } from "lucide-react";
import { getProgress } from "@/lib/enrollment";

type Enrollment = {
  courseId: string;
  completedModulesJson: string;
  enrolledAt: string;
  course: { title: string; modulesCount: number };
};
type Student = { id: string; name: string; email: string; createdAt: string; enrollments: Enrollment[] };
type CourseOption = { id: string; title: string };

function StudentRow({ student, courses }: { student: Student; courses: CourseOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const enrolledIds = new Set(student.enrollments.map((e) => e.courseId));
  const availableCourses = courses.filter((c) => !enrolledIds.has(c.id));

  async function handleEnroll() {
    if (!selected) return;
    setEnrolling(true);
    await fetch(`/api/admin/students/${student.id}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selected }),
    });
    setEnrolling(false);
    setSelected("");
    router.refresh();
  }

  async function handleRemove(courseId: string) {
    await fetch(`/api/admin/students/${student.id}/enrollments/${courseId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-brand-ink">{student.name}</p>
          <p className="text-xs text-brand-muted">{student.email}</p>
        </div>
        <p className="text-xs text-brand-muted">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
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
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
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
            disabled={!selected || enrolling}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pink px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
          >
            <UserPlus size={13} /> Enroll
          </button>
        </div>
      )}
    </div>
  );
}

export default function StudentsTable({ students, courses }: { students: Student[]; courses: CourseOption[] }) {
  if (students.length === 0) {
    return (
      <p className="rounded-2xl border border-brand-border bg-brand-card px-5 py-10 text-center text-sm text-brand-muted">
        No students have signed up yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {students.map((s) => (
        <StudentRow key={s.id} student={s} courses={courses} />
      ))}
    </div>
  );
}
