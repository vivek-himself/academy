"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, SelectField, NumberField, CheckboxField } from "../../components/FormField";
import ImageUploadField from "../../components/ImageUploadField";
import StringListField from "../../components/StringListField";
import RepeaterField from "../../components/RepeaterField";
import SaveBar from "../../components/SaveBar";
import { safeJsonParse } from "@/lib/json";

export type CourseFormValue = {
  id?: string;
  slug: string;
  title: string;
  level: string;
  categoryId: string;
  mentorId: string;
  rating: number;
  reviewsCount: number;
  students: number;
  modulesCount: number;
  duration: string;
  price: number;
  originalPrice: number | null;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  description: string;
  keyPointsJson: string;
  modulesJson: string;
  toolsJson: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
};

export default function CourseForm({
  initial,
  categories,
  mentors,
}: {
  initial: CourseFormValue;
  categories: { id: string; name: string }[];
  mentors: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const keyPoints = safeJsonParse<string[]>(value.keyPointsJson, []);
  const modules = safeJsonParse<Record<string, string>[]>(value.modulesJson, []);
  const tools = safeJsonParse<Record<string, string>[]>(value.toolsJson, []);

  function set<K extends keyof CourseFormValue>(key: K, v: CourseFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const isEdit = Boolean(value.id);
    const res = await fetch(isEdit ? `/api/admin/courses/${value.id}` : "/api/admin/courses", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-border bg-white p-6 sm:grid-cols-2">
        <TextField label="Course Title" required maxLength={120} value={value.title} onChange={(v) => set("title", v)} />
        <TextField
          label="Slug"
          required
          description="Used in the URL, e.g. /courses/your-slug. Lowercase, hyphen-separated."
          value={value.slug}
          onChange={(v) => set("slug", v)}
        />
        <SelectField
          label="Category"
          value={value.categoryId}
          onChange={(v) => set("categoryId", v)}
          options={[{ label: "None", value: "" }, ...categories.map((c) => ({ label: c.name, value: c.id }))]}
        />
        <SelectField
          label="Mentor"
          value={value.mentorId}
          onChange={(v) => set("mentorId", v)}
          options={[{ label: "None", value: "" }, ...mentors.map((m) => ({ label: m.name, value: m.id }))]}
        />
        <SelectField
          label="Level"
          value={value.level}
          onChange={(v) => set("level", v)}
          options={["Beginner", "Intermediate", "Master"].map((l) => ({ label: l, value: l }))}
        />
        <TextField label="Duration" description='e.g. "1h 30m"' value={value.duration} onChange={(v) => set("duration", v)} />
        <NumberField label="Price ($)" step={0.01} value={value.price} onChange={(v) => set("price", v)} />
        <NumberField
          label="Original Price ($) — optional, shown struck-through"
          step={0.01}
          value={value.originalPrice ?? 0}
          onChange={(v) => set("originalPrice", v || null)}
        />
        <NumberField label="Rating (0-5)" step={0.1} value={value.rating} onChange={(v) => set("rating", v)} />
        <NumberField label="Reviews Count" value={value.reviewsCount} onChange={(v) => set("reviewsCount", v)} />
        <NumberField label="Students" value={value.students} onChange={(v) => set("students", v)} />
        <NumberField label="Modules Count" value={value.modulesCount} onChange={(v) => set("modulesCount", v)} />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <ImageUploadField
          label="Course Card / Cover Image"
          desktopValue={value.imageDesktopUrl}
          onDesktopChange={(v) => set("imageDesktopUrl", v)}
          mobileValue={value.imageMobileUrl}
          onMobileChange={(v) => set("imageMobileUrl", v)}
          desktopSize="1200 × 900px (4:3)"
          mobileSize="800 × 600px (4:3)"
        />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-white p-6">
        <TextAreaField
          label="Description"
          rows={5}
          maxLength={1200}
          description="Shown in the About tab on the course page."
          value={value.description}
          onChange={(v) => set("description", v)}
        />
        <StringListField
          label="Key Points"
          description="Bulleted checklist shown under the description."
          items={keyPoints}
          onChange={(items) => set("keyPointsJson", JSON.stringify(items))}
          placeholder="e.g. Understand the basics of Prototype & Animation"
        />
        <RepeaterField
          label="Modules"
          description="Shown in the sidebar module list on the course page."
          items={modules}
          onChange={(items) => set("modulesJson", JSON.stringify(items))}
          fields={[
            { key: "title", label: "Module title" },
            { key: "duration", label: "Day / duration label" },
          ]}
          emptyItem={{ title: "", duration: "" }}
          addLabel="Add module"
        />
        <RepeaterField
          label="Tools"
          description="Shown in the Tools tab on the course page."
          items={tools}
          onChange={(items) => set("toolsJson", JSON.stringify(items))}
          fields={[
            { key: "name", label: "Tool name" },
            { key: "plan", label: "Plan label (e.g. Freemium)" },
          ]}
          emptyItem={{ name: "", plan: "" }}
          addLabel="Add tool"
        />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">SEO</h3>
        <TextField
          label="SEO Title"
          maxLength={60}
          description="Shown in browser tabs and search results. Keep under 60 characters."
          value={value.seoTitle}
          onChange={(v) => set("seoTitle", v)}
        />
        <TextAreaField
          label="SEO Description"
          rows={2}
          maxLength={160}
          description="Shown in search results. Keep under 160 characters."
          value={value.seoDescription}
          onChange={(v) => set("seoDescription", v)}
        />
        <CheckboxField
          label="Published"
          description="Unpublished courses are hidden from the public site."
          checked={value.published}
          onChange={(v) => set("published", v)}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <SaveBar saving={saving} label="Save Course" type="submit" />
    </form>
  );
}
