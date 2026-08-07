"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { TextField, NumberField, SelectField } from "../../components/FormField";
import ChipMultiSelect from "@/components/ui/ChipMultiSelect";
import TimeSelect from "@/components/ui/TimeSelect";
import SaveBar from "../../components/SaveBar";
import { WEEKDAY_OPTIONS } from "@/lib/batch";

export type BatchFormValue = {
  id?: string;
  name: string;
  classDays: string[];
  startTime: string; // "" or "HH:MM"
  endTime: string; // "" or "HH:MM"
  meetingUrl: string;
  completedChapters: number;
  capacity: number;
  startDate: string; // "" or "YYYY-MM-DD"
  endDate: string; // "" or "YYYY-MM-DD"
  courseId: string;
};

type CourseOption = { id: string; title: string; modules: { title: string; duration: string }[] };

export default function BatchForm({ initial, courses }: { initial: BatchFormValue; courses: CourseOption[] }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BatchFormValue>(key: K, v: BatchFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  const selectedCourse = courses.find((c) => c.id === value.courseId) ?? null;
  const totalChapters = selectedCourse?.modules.length ?? 0;

  function handleCourseChange(courseId: string) {
    set("courseId", courseId);
    // Switching courses invalidates the old chapter count — start fresh rather than
    // silently carrying over a number that no longer matches this course's module list.
    set("completedChapters", 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const isEdit = Boolean(value.id);
    const res = await fetch(isEdit ? `/api/admin/batches/${value.id}` : "/api/admin/batches", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: value.name,
        classDays: value.classDays,
        startTime: value.startTime || null,
        endTime: value.endTime || null,
        meetingUrl: value.meetingUrl || null,
        completedChapters: value.completedChapters,
        capacity: value.capacity || null,
        startDate: value.startDate || null,
        endDate: value.endDate || null,
        courseId: value.courseId || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    if (isEdit) {
      router.refresh();
    } else {
      router.push(`/admin/batches/${data.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-border bg-brand-card p-6 sm:grid-cols-2">
        <TextField label="Batch Name" required maxLength={80} value={value.name} onChange={(v) => set("name", v)} />
        <SelectField
          label="Course"
          description="Optional — the course this batch is studying."
          value={value.courseId}
          onChange={handleCourseChange}
          options={[{ label: "No course linked", value: "" }, ...courses.map((c) => ({ label: c.title, value: c.id }))]}
        />

        <div className="sm:col-span-2">
          <p className="mb-1.5 block text-sm font-semibold text-brand-ink">Class Days</p>
          <ChipMultiSelect options={WEEKDAY_OPTIONS} value={value.classDays} onChange={(v) => set("classDays", v)} />
        </div>

        <TimeSelect label="Start Time" value={value.startTime} onChange={(v) => set("startTime", v)} />
        <TimeSelect label="End Time" value={value.endTime} onChange={(v) => set("endTime", v)} />

        <div className="sm:col-span-2">
          <TextField
            label="Meeting Link"
            description="Google Meet or Zoom link — students are sent here after marking attendance."
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            value={value.meetingUrl}
            onChange={(v) => set("meetingUrl", v)}
          />
        </div>

        <NumberField
          label="Capacity"
          description="Leave at 0 for no fixed limit."
          value={value.capacity}
          onChange={(v) => set("capacity", v)}
        />
        <div />
        <TextField label="Start Date" type="date" value={value.startDate} onChange={(v) => set("startDate", v)} />
        <TextField label="End Date" type="date" value={value.endDate} onChange={(v) => set("endDate", v)} />
      </div>

      {selectedCourse && (
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
          <SelectField
            label="Chapters Completed"
            description="Drives every batch student's progress bar and completed-chapters count — chapters are marked done in order from the start."
            value={String(value.completedChapters)}
            onChange={(v) => set("completedChapters", Number(v))}
            options={Array.from({ length: totalChapters + 1 }, (_, n) => ({ label: `${n} of ${totalChapters}`, value: String(n) }))}
          />
          {totalChapters > 0 && (
            <ul className="mt-4 flex flex-col gap-1">
              {selectedCourse.modules.map((m, i) => {
                const done = i < value.completedChapters;
                return (
                  <li key={i} className="flex items-center gap-2.5 py-1 text-sm">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                        done ? "bg-emerald-500 text-white" : "bg-white text-brand-muted ring-1 ring-brand-border"
                      }`}
                    >
                      {done ? <CheckCircle2 size={12} /> : i + 1}
                    </span>
                    <span className={done ? "text-brand-ink" : "text-brand-ink/70"}>{m.title}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <SaveBar saving={saving} label="Save Batch" type="submit" />
    </form>
  );
}
