"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField } from "../../components/FormField";
import ImageUploadField from "../../components/ImageUploadField";
import SaveBar from "../../components/SaveBar";

export type MentorFormValue = {
  id?: string;
  name: string;
  role: string;
  bio: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
};

export default function MentorForm({ initial }: { initial: MentorFormValue }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof MentorFormValue>(key: K, v: MentorFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const isEdit = Boolean(value.id);
    const res = await fetch(isEdit ? `/api/admin/mentors/${value.id}` : "/api/admin/mentors", {
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
    router.push("/admin/mentors");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-brand-border bg-brand-card p-6 sm:grid-cols-2">
        <TextField label="Name" required maxLength={80} value={value.name} onChange={(v) => set("name", v)} />
        <TextField label="Role / Title" required maxLength={80} value={value.role} onChange={(v) => set("role", v)} />
        <TextField label="LinkedIn URL" value={value.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} />
        <TextField label="Website URL" value={value.websiteUrl} onChange={(v) => set("websiteUrl", v)} />
        <div className="sm:col-span-2">
          <TextAreaField
            label="Bio"
            rows={4}
            maxLength={400}
            required
            value={value.bio}
            onChange={(v) => set("bio", v)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
        <ImageUploadField
          label="Photo"
          desktopValue={value.imageDesktopUrl}
          onDesktopChange={(v) => set("imageDesktopUrl", v)}
          mobileValue={value.imageMobileUrl}
          onMobileChange={(v) => set("imageMobileUrl", v)}
          desktopSize="800 × 600px (4:3)"
          mobileSize="600 × 450px (4:3)"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <SaveBar saving={saving} label="Save Mentor" type="submit" />
    </form>
  );
}
