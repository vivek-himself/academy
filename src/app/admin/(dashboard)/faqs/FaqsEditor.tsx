"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RepeaterField from "../../components/RepeaterField";

type Faq = { question: string; answer: string };

export default function FaqsEditor({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFaqs);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSave() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqs }),
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
          label="FAQ Entries"
          description="The first entry with an answer opens by default on the site. Leave answer blank to use placeholder copy."
          items={faqs as unknown as Record<string, string | boolean>[]}
          onChange={(items) => setFaqs(items as unknown as Faq[])}
          fields={[
            { key: "question", label: "Question" },
            { key: "answer", label: "Answer", type: "textarea" },
          ]}
          emptyItem={{ question: "", answer: "" }}
          addLabel="Add FAQ"
        />
      </div>
      {status && <p className="text-sm font-medium text-brand-ink">{status}</p>}
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save FAQs"}
        </button>
      </div>
    </div>
  );
}
