"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RepeaterField from "../../components/RepeaterField";
import SaveBar from "../../components/SaveBar";

type Testimonial = { quote: string; name: string; role: string; avatarUrl: string };

export default function TestimonialsEditor({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSave() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testimonials }),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("Failed to save.");
      return;
    }
    setStatus("Saved!");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <RepeaterField
          label="Testimonials"
          description="Shown on the homepage, Success Stories page, and Growth landing pages."
          items={testimonials as unknown as Record<string, string | boolean>[]}
          onChange={(items) => setTestimonials(items as unknown as Testimonial[])}
          fields={[
            { key: "quote", label: "Quote", type: "textarea" },
            { key: "name", label: "Name" },
            { key: "role", label: "Role / Company" },
          ]}
          emptyItem={{ quote: "", name: "", role: "", avatarUrl: "" }}
          addLabel="Add testimonial"
        />
      </div>
      <SaveBar onSave={handleSave} saving={saving} status={status} label="Save Testimonials" />
    </div>
  );
}
