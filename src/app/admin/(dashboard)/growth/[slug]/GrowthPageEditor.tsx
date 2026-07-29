"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField } from "../../../components/FormField";
import ImageUploadField from "../../../components/ImageUploadField";
import StringListField from "../../../components/StringListField";
import RepeaterField from "../../../components/RepeaterField";
import { safeJsonParse } from "@/lib/json";

type GrowthPageValue = {
  slug: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  checklistJson: string;
  ctaLabel: string;
  heroImageDesktopUrl: string;
  heroImageMobileUrl: string;
  expectParagraph: string;
  dayTabsJson: string;
  expectImageDesktopUrl: string;
  expectImageMobileUrl: string;
  quickFactsJson: string;
  benefitsTitle: string;
  benefitsJson: string;
  benefitsCta: string;
  seoTitle: string;
  seoDescription: string;
};

export default function GrowthPageEditor({ page }: { page: GrowthPageValue }) {
  const router = useRouter();
  const [value, setValue] = useState(page);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const checklist = safeJsonParse<string[]>(value.checklistJson, []);
  const dayTabs = safeJsonParse<string[]>(value.dayTabsJson, []);
  const quickFacts = safeJsonParse<Record<string, string>[]>(value.quickFactsJson, []);
  const benefits = safeJsonParse<Record<string, string>[]>(value.benefitsJson, []);

  function set<K extends keyof GrowthPageValue>(key: K, v: GrowthPageValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch(`/api/admin/growth/${value.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin/growth");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-muted">Hero</h3>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Title (line 1)" maxLength={40} value={value.title} onChange={(v) => set("title", v)} />
            <TextField label="Title Highlight (line 2, pink)" maxLength={40} value={value.titleHighlight} onChange={(v) => set("titleHighlight", v)} />
          </div>
          <TextAreaField label="Subtitle" rows={2} maxLength={220} value={value.subtitle} onChange={(v) => set("subtitle", v)} />
          <StringListField label="Checklist (4 short trust badges)" items={checklist} onChange={(v) => set("checklistJson", JSON.stringify(v))} />
          <TextField label="Primary Button Label" maxLength={30} value={value.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
          <ImageUploadField
            label="Hero Image"
            desktopValue={value.heroImageDesktopUrl}
            onDesktopChange={(v) => set("heroImageDesktopUrl", v)}
            mobileValue={value.heroImageMobileUrl}
            onMobileChange={(v) => set("heroImageMobileUrl", v)}
            desktopSize="800 × 800px (square)"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-muted">What To Expect</h3>
        <div className="flex flex-col gap-5">
          <TextAreaField label="Paragraph" rows={4} maxLength={600} value={value.expectParagraph} onChange={(v) => set("expectParagraph", v)} />
          <StringListField label="Day Tabs" items={dayTabs} onChange={(v) => set("dayTabsJson", JSON.stringify(v))} />
          <ImageUploadField
            label="Section Image"
            desktopValue={value.expectImageDesktopUrl}
            onDesktopChange={(v) => set("expectImageDesktopUrl", v)}
            mobileValue={value.expectImageMobileUrl}
            onMobileChange={(v) => set("expectImageMobileUrl", v)}
            desktopSize="700 × 700px (square)"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-muted">Quick Facts</h3>
        <RepeaterField
          label="Quick Facts (4 recommended)"
          items={quickFacts}
          onChange={(v) => set("quickFactsJson", JSON.stringify(v))}
          fields={[
            { key: "badge", label: "Badge label (short)" },
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          emptyItem={{ badge: "", title: "", description: "" }}
          addLabel="Add quick fact"
        />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-muted">Benefits</h3>
        <div className="flex flex-col gap-5">
          <TextField label="Section Title" maxLength={80} value={value.benefitsTitle} onChange={(v) => set("benefitsTitle", v)} />
          <RepeaterField
            label="Benefits (3 recommended)"
            description='Icon must be one of: users, award, flag, lock, clock, send, search, star'
            items={benefits}
            onChange={(v) => set("benefitsJson", JSON.stringify(v))}
            fields={[
              { key: "icon", label: "Icon key" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
            emptyItem={{ icon: "star", title: "", description: "" }}
            addLabel="Add benefit"
          />
          <TextField label="Button Label" maxLength={30} value={value.benefitsCta} onChange={(v) => set("benefitsCta", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand-muted">SEO</h3>
        <div className="flex flex-col gap-5">
          <TextField label="SEO Title" maxLength={60} value={value.seoTitle} onChange={(v) => set("seoTitle", v)} />
          <TextAreaField label="SEO Description" rows={2} maxLength={160} value={value.seoDescription} onChange={(v) => set("seoDescription", v)} />
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>
    </form>
  );
}
