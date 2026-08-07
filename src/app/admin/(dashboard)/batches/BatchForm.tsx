"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, NumberField, SelectField } from "../../components/FormField";
import ChipMultiSelect from "@/components/ui/ChipMultiSelect";
import SaveBar from "../../components/SaveBar";
import { WEEKDAY_OPTIONS } from "@/lib/batch";

export type BatchFormValue = {
  id?: string;
  name: string;
  classDays: string[];
  startTime: string; // "" or "HH:MM"
  endTime: string; // "" or "HH:MM"
  capacity: number;
  startDate: string; // "" or "YYYY-MM-DD"
  endDate: string; // "" or "YYYY-MM-DD"
  courseId: string;
};

type CourseOption = { id: string; title: string };

export default function BatchForm({ initial, courses }: { initial: BatchFormValue; courses: CourseOption[] }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BatchFormValue>(key: K, v: BatchFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
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
          onChange={(v) => set("courseId", v)}
          options={[{ label: "No course linked", value: "" }, ...courses.map((c) => ({ label: c.title, value: c.id }))]}
        />

        <div className="sm:col-span-2">
          <p className="mb-1.5 block text-sm font-semibold text-brand-ink">Class Days</p>
          <ChipMultiSelect options={WEEKDAY_OPTIONS} value={value.classDays} onChange={(v) => set("classDays", v)} />
        </div>

        <TextField label="Start Time" type="time" value={value.startTime} onChange={(v) => set("startTime", v)} />
        <TextField label="End Time" type="time" value={value.endTime} onChange={(v) => set("endTime", v)} />

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

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <SaveBar saving={saving} label="Save Batch" type="submit" />
    </form>
  );
}
