"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type Message = { id: string; sender: string; body: string; createdAt: string };

export default function ThreadView({ userId, messages }: { userId: string; messages: Message[] }) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/messages/${userId}/read`, { method: "PATCH" });
  }, [userId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setError("");
    setSending(true);
    const res = await fetch(`/api/admin/messages/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send.");
      return;
    }
    setReply("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-brand-card p-6">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-brand-muted">No messages yet — send one below.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.sender === "admin" ? "bg-brand-pink text-white" : "bg-brand-surface text-brand-ink"
                }`}
              >
                <p>{m.body}</p>
                <p className={`mt-1 text-[10px] ${m.sender === "admin" ? "text-white/70" : "text-brand-muted"}`}>
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-end gap-3 rounded-2xl border border-brand-border bg-brand-card p-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
          placeholder="Type a reply..."
          className="flex-1 resize-none rounded-lg border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-pink"
        />
        <button
          type="submit"
          disabled={!reply.trim() || sending}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-pink-dark disabled:opacity-60"
        >
          <Send size={14} /> Send
        </button>
      </form>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
