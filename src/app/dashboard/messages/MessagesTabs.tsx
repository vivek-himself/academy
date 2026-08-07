"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const TABS = [
  { id: "notifications", label: "Notifications" },
  { id: "direct", label: "Direct Messages" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type NotificationRow = { id: string; title: string; body: string; createdAt: string; readAt: string | null };
type MessageRow = { id: string; sender: string; body: string; createdAt: string; readAt: string | null };

export default function MessagesTabs({
  notifications,
  messages,
}: {
  notifications: NotificationRow[];
  messages: MessageRow[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("notifications");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.readAt).length;
  const unreadMessages = messages.filter((m) => m.sender === "admin" && !m.readAt).length;

  // Mark whichever tab is open as read once it's actually viewed.
  useEffect(() => {
    if (activeTab === "notifications" && unreadNotifications > 0) {
      fetch("/api/dashboard/notifications/read-all", { method: "PATCH" }).then(() => router.refresh());
    } else if (activeTab === "direct" && unreadMessages > 0) {
      fetch("/api/dashboard/messages/read", { method: "PATCH" }).then(() => router.refresh());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setError("");
    setSending(true);
    const res = await fetch("/api/dashboard/messages", {
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
    <div>
      <div className="mb-6 flex gap-2 rounded-2xl border border-brand-border bg-white p-1.5">
        {TABS.map((tab) => {
          const badge = tab.id === "notifications" ? unreadNotifications : unreadMessages;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? "bg-brand-pink text-white" : "text-brand-ink/70 hover:bg-brand-surface"
              }`}
            >
              {tab.label}
              {badge > 0 && <span className="ml-2 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">{badge}</span>}
            </button>
          );
        })}
      </div>

      {activeTab === "notifications" && (
        <div className="flex flex-col gap-3">
          {notifications.length === 0 ? (
            <p className="rounded-2xl border border-brand-border bg-white px-5 py-10 text-center text-sm text-brand-muted">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="rounded-2xl border border-brand-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-brand-ink">{n.title}</p>
                  <span className="text-xs text-brand-muted">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1.5 text-sm text-brand-muted">{n.body}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "direct" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-white p-6">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-brand-muted">
                No messages yet — send one below and the Academy team will reply here.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "student" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender === "student" ? "bg-brand-pink text-white" : "bg-brand-surface text-brand-ink"
                    }`}
                  >
                    <p>{m.body}</p>
                    <p className={`mt-1 text-[10px] ${m.sender === "student" ? "text-white/70" : "text-brand-muted"}`}>
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-end gap-3 rounded-2xl border border-brand-border bg-white p-4">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              placeholder="Message the Academy team..."
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
      )}
    </div>
  );
}
