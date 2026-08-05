"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RepeaterField from "../../components/RepeaterField";
import SaveBar from "../../components/SaveBar";

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
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
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
      <SaveBar onSave={handleSave} saving={saving} status={status} label="Save FAQs" />
    </div>
  );
}
