"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { TextField, TextAreaField, SelectField } from "../../components/FormField";

type BatchOption = { id: string; name: string };
type StudentOption = { id: string; name: string; email: string };

const SCOPE_OPTIONS = [
  { label: "Individual student", value: "individual" },
  { label: "A batch", value: "batch" },
  { label: "Everyone", value: "all" },
];

export default function NotificationComposer({ batches, students }: { batches: BatchOption[]; students: StudentOption[] }) {
  const router = useRouter();
  const [scope, setScope] = useState("individual");
  const [batchId, setBatchId] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (scope === "batch" && !batchId) {
      setError("Select a batch.");
      return;
    }
    if (scope === "individual" && !userId) {
      setError("Select a student.");
      return;
    }

    setSending(true);
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, scope, batchId: batchId || undefined, userId: userId || undefined }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setTitle("");
    setBody("");
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-5 rounded-2xl border border-brand-border bg-brand-card p-6">
      <h3 className="text-sm font-bold text-brand-ink">Send a Notification</h3>

      <SelectField label="Send to" value={scope} onChange={setScope} options={SCOPE_OPTIONS} />

      {scope === "batch" && (
        <SelectField
          label="Batch"
          value={batchId}
          onChange={setBatchId}
          options={[{ label: "Select a batch...", value: "" }, ...batches.map((b) => ({ label: b.name, value: b.id }))]}
        />
      )}

      {scope === "individual" && (
        <SelectField
          label="Student"
          value={userId}
          onChange={setUserId}
          options={[
            { label: "Select a student...", value: "" },
            ...students.map((s) => ({ label: `${s.name} (${s.email})`, value: s.id })),
          ]}
        />
      )}

      <TextField label="Title" required maxLength={100} value={title} onChange={setTitle} />
      <TextAreaField label="Message" required rows={3} maxLength={500} value={body} onChange={setBody} />

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      {success && <p className="text-sm font-medium text-green-600">Notification sent.</p>}

      <button
        type="submit"
        disabled={sending}
        className="flex w-fit items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
      >
        <Send size={14} /> {sending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
}
