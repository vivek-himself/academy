"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, CheckboxField } from "../../components/FormField";
import ImageUploadField from "../../components/ImageUploadField";
import StringListField from "../../components/StringListField";
import SaveBar from "../../components/SaveBar";
import { safeJsonParse } from "@/lib/json";

export type BlogPostFormValue = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  date: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  tagsJson: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
};

export default function BlogPostForm({ initial }: { initial: BlogPostFormValue }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tags = safeJsonParse<string[]>(value.tagsJson, []);

  function set<K extends keyof BlogPostFormValue>(key: K, v: BlogPostFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const isEdit = Boolean(value.id);
    const res = await fetch(isEdit ? `/api/admin/posts/${value.id}` : "/api/admin/posts", {
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
    router.push("/admin/knowledge-base");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-border bg-brand-card p-6 sm:grid-cols-2">
        <TextField label="Title" required maxLength={140} value={value.title} onChange={(v) => set("title", v)} />
        <TextField
          label="Slug"
          required
          description="Used in the URL, e.g. /knowledgebase/your-slug"
          value={value.slug}
          onChange={(v) => set("slug", v)}
        />
        <TextField label="Author" value={value.author} onChange={(v) => set("author", v)} />
        <TextField label="Date (display text)" description='e.g. "Nov 29, 2025"' value={value.date} onChange={(v) => set("date", v)} />
        <TextField label="Category" value={value.category} onChange={(v) => set("category", v)} />
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
        <ImageUploadField
          label="Cover Image"
          desktopValue={value.imageDesktopUrl}
          onDesktopChange={(v) => set("imageDesktopUrl", v)}
          mobileValue={value.imageMobileUrl}
          onMobileChange={(v) => set("imageMobileUrl", v)}
          desktopSize="1440 × 900px (16:10)"
          mobileSize="960 × 600px (16:10)"
        />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-brand-card p-6">
        <TextAreaField
          label="Excerpt"
          rows={2}
          maxLength={160}
          description="Shown on the blog listing card."
          value={value.excerpt}
          onChange={(v) => set("excerpt", v)}
        />
        <TextAreaField
          label="Body"
          rows={10}
          description="The full article content."
          value={value.body}
          onChange={(v) => set("body", v)}
        />
        <StringListField label="Tags" items={tags} onChange={(v) => set("tagsJson", JSON.stringify(v))} />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-brand-card p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-muted">SEO</h3>
        <TextField label="SEO Title" maxLength={60} value={value.seoTitle} onChange={(v) => set("seoTitle", v)} />
        <TextAreaField label="SEO Description" rows={2} maxLength={160} value={value.seoDescription} onChange={(v) => set("seoDescription", v)} />
        <CheckboxField label="Published" checked={value.published} onChange={(v) => set("published", v)} />
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <SaveBar saving={saving} label="Save Post" type="submit" />
    </form>
  );
}
